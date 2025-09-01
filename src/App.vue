<script setup>
 import Dashboard from "./Dashboard.vue";
 import Rockets   from "./Rockets.vue";
 import Launches  from "./Launches.vue";
 import Starlink  from "./Starlink.vue";

 import {ref} from "vue";

 const pathname = ref(window.location.pathname);

 const updateUI = () => pathname.value = window.location.pathname;

 const navigateTo = href => {
   if(href !== window.location.pathname){
     window.history.pushState(null, "", href);
     updateUI();
   }
 };

 const onClick = event => {
   event.preventDefault();
   const href = event.target.getAttribute("href");
   navigateTo(href);
 };

 const dashboardData = ref(null);

 fetch("/api/dashboard")
   .then(response => {
     response.json()
             .then(data => dashboardData.value = data);
   });

 window.addEventListener('popstate', updateUI);
</script>

<template>
  <header>
    <h1><a @click="onClick" href="/">SpaceX</a></h1>
    <nav>
      <a @click="onClick" href="/">DASHBOARD</a>
      <a @click="onClick" href="/rockets">ROCKETS</a>
      <a @click="onClick" href="/launches">LAUNCHES</a>
      <a @click="onClick" href="/starlink/1">STARLINK</a>
    </nav>
  </header>
  <main v-if="dashboardData === null">Loading Data...</main>
  <Rockets   :pathname="pathname" :onClick="onClick" :navigateTo="navigateTo" :dashboardData="dashboardData" v-else-if="pathname.match(/^\/rockets/) !== null"></Rockets>
  <Launches  :pathname="pathname" :onClick="onClick" :navigateTo="navigateTo" :dashboardData="dashboardData" v-else-if="pathname.match(/^\/launches/) !== null"></Launches>
  <Starlink  :pathname="pathname" :onClick="onClick" :navigateTo="navigateTo" :dashboardData="dashboardData" v-else-if="pathname.match(/^\/starlink/) !== null"></Starlink>
  <Dashboard :pathname="pathname" :onClick="onClick" :navigateTo="navigateTo" :dashboardData="dashboardData" v-else-if="pathname === '/'"></Dashboard>
  <main       v-else>Not Found</main>
</template>
