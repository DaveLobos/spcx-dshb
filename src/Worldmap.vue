<script setup>
 import {ref, watchEffect} from "vue";
 import * as d3 from "d3";

 const chartHTML = ref("");

 watchEffect(() => {
   let width = 640;
   let height = 480;
   let svg = d3.create("svg")
               .attr("width", width)
               .attr("height", height);
   
   const projection = d3.geoNaturalEarth1()
                        .scale(width / 1.3 / Math.PI)
                        .translate([width / 2, height / 2])

   d3.json(
     "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
   )
                        .then(
                          data => {
                            svg.append("g")
                               .selectAll("path")
                               .data(data.features)
                               .join("path")
                               .attr("fill", "#ddd")
                               .attr("d", d3.geoPath().projection(projection));
                            chartHTML.value = svg.node().outerHTML;
                          }
                        );
 });
</script>

<template>
  <div class="worldmap" v-html="chartHTML"></div>
</template>
