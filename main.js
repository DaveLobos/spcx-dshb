const http  = require("http");
const https = require("https");
const fs    = require("fs");
const path  = require("path");

const hostname = "0.0.0.0";
const port = 3000;

let dashboardData = {rockets:[], totalLaunches:0, totalStarlink:0};

let apiData = {
  "rockets" :{ts:0, data:[]},
  "launches":{ts:0, data:[]},
  "starlink":{ts:0, data:[]},
};

const apiDataKeys = Object.keys(apiData);

const updateApiData = cbk => {
  const fetchEndpoint = indx => {
    const key = apiDataKeys[indx];

    if(key !== undefined){
      let chunks = [];
      //let path = `/${key}.json`;
      let path = `/latest/${key}`;

      const req = https.request(
        {
          //method:"GET", path, hostname:'127.0.0.1', port:'8000'
          method:"GET", path, hostname:'api.spacexdata.com', port:'443',
          headers:{
            'Content-Type':'application/json',
            'Accept':'application/json'
          }
        },
        res => {
          const {statusCode} = res;

          if(statusCode === 200){
            res.setEncoding('utf8');
            res.on('data', chunk => chunks = `${chunks}${chunk}`);
            res.on('end', () => {
              let data;
              try{
                data = JSON.parse(chunks);
              }catch(error){
                cbk(error);
              }
              if(data !== undefined){
                const ts = Date.now();
                apiData[key] = {ts, data};
                console.log(`updated ${path} at ${ts}`);
              }
              fetchEndpoint(indx + 1);
            });
          }else{
            cbk({path, statusCode});
          }
        }
      );
      req.on("error", error => console.log(error));
      req.end("");
    }else{
      dashboardData = {
        rockets:apiData.rockets.data.map(({id, name}) => ({id, name})),
        totalLaunches:apiData.launches.data.length,
        totalStarlink:apiData.starlink.data.length,
      };
      cbk();
    }
  };

  fetchEndpoint(0);
};

updateApiData(error => {
  if(error !== undefined){
    console.error(error);
  }else{
    const server = http.createServer((req, res) => {
      if(req.method === "GET"){
        const url = new URL(req.url, `https://${req.headers.host}`);
        let matches = [];

        if((matches = url.pathname.match(/^\/api\/(dashboard|rockets|launches|starlink)$/)) !== null){
          const endpoint = matches[1];

          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          if(endpoint === "dashboard"){
            res.end(JSON.stringify(dashboardData));
          }else{
            if(endpoint === "starlink"){
              const page = +url.searchParams.get("page") || 1;
              const offset = (page - 1) * 200;
              res.end(JSON.stringify(
                {page, totalPages:Math.ceil(apiData["starlink"].data.length / 200), data:apiData["starlink"].data.slice(offset, offset + 200)}
              ));
            }else{
              res.end(JSON.stringify(apiData[endpoint]));
            }
          }
        }else if(url.pathname.match(/^\/static\/[a-z0-9\-\/]+\.[a-z]+$/) !== null){
          const filePath = path.join(__dirname, url.pathname);
          const readStream = fs.createReadStream(filePath);

          readStream.on("error", error => {
            res.statusCode = 404;
            res.end("Not Found");
          });
          res.statusCode = 200;
          res.setHeader("Content-Type", url.pathname.match(/\.css$/) !== null ? "text/css" : "text/javascript");
          readStream.pipe(res);
        }else{
          const readStream = fs.createReadStream("./index.html");

          res.statusCode = 200;
          res.setHeader("Content-Type", "text/html");
          readStream.pipe(res);
        }
      }else{
        res.statusCode = 405;
        res.end("Method Not Allowed\n");
      }
    });

    server.listen(port, hostname, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
  }
});

setInterval(() => updateApiData(error => {
  if(error !== undefined){
    console.error(error);
  }
}), 300000);
