<script setup>
 import {ref, watchEffect} from "vue";
 import Piechart from "./Piechart.vue";

 const selectedRocket = ref(null);
 const selectedData = ref(null);
 const successData = ref(null);

 const props = defineProps({
   dashboardData:Object,
   pathname:String,
   navigateTo:Function,
 });

 const rocketOptionsChange = ({target:{value}}) => props.navigateTo(`/launches${value !== "All Rockets" ? `/${value}` : ""}`);

 fetch("/api/launches")
   .then(response => {
     response.json()
             .then(json => {
               console.log(json);
               watchEffect(() => {
                 let matches = props.pathname.match(/^\/launches(?:\/(.*)|)/);
                 if(matches[1] === undefined){
                   selectedRocket.value = null;
                   selectedData.value = json.data;
                 }else{
                   rocket = props.dashboardData.rockets.find(({id}) => id === matches[1]);
                   if(rocket !== undefined){
                     selectedRocket.value = rocket;
                     selectedData.value = json.data.filter(({rocket}) => rocket === matches[1])
                   }else{
                     selectedRocket.value = null;
                     selectedData.value = json.data;
                   }
                 }
                 successData.value = [
                   {name:"Success", value:selectedData.value.filter(({success}) => success === true).length},
                   {name:"Failure", value:selectedData.value.filter(({success}) => success !== true).length},
                 ];
               });
             });
   });
</script>

<template>
  <main v-if="selectedData === null">Loading Data...</main>
  <main id="launches" v-else>
    <h2>Launches - {{selectedRocket === null ? "All Rockets" : selectedRocket.name}}</h2>
    <div class="filter">
      <strong>Filter: </strong>
      <select @change="rocketOptionsChange" :value="selectedRocket === null ? 'All Rockets' : selectedRocket.id">
        <option value="All Rockets">All Rockets</option>
        <option v-for="({id, name}) in dashboardData.rockets" :value="id">{{name}}</option>
      </select>
    </div>
    <div class="content">
      <table>
        <tr>
          <th>#</th>
          <th>NAME</th>
          <th>DATE</th>
          <th>SUCCESS</th>
        </tr>
        <tr v-for="({name, date_utc, success}, indx) in selectedData">
          <td>{{indx + 1}}</td>
          <td>{{name}}</td>
          <td>{{date_utc}}</td>
          <td :class="success === true ? 'success' : 'fail'">{{success === true ? "YES" : "NO"}}</td>
        </tr>
      </table>
      <Piechart v-if="successData !== null" :data="successData" />
    </div>
  </main>
</template>
