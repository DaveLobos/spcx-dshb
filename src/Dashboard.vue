<script setup>
 const props = defineProps({
   dashboardData:Object,
   onClick:Function
 });

</script>

<template>
  <main id="dashboard">
    <h2>Dashboard</h2>
    <div>
      <div>
        <h3>{{dashboardData.rockets.length}}</h3>
        <div>Total Rockets</div>
        <a @click="onClick" href="/rockets">Go to Rockets</a>
      </div>
      <div>
        <h3>{{dashboardData.totalLaunches}}</h3>
        <div>Total Launches</div>
        <a @click="onClick" href="/launches">Go to Launches</a>
      </div>
      <div>
        <h3>{{dashboardData.totalStarlink}}</h3>
        <div>Total Starlink Records</div>
        <a @click="onClick" href="/starlink">Go to Starlink</a>
      </div>
    </div>
  </main>
</template>
