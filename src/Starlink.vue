<script setup>
 import {ref, watchEffect} from "vue";

 const data = ref(null);

 const props = defineProps({
   pathname:String,
   navigateTo:Function,
 });

 watchEffect(() => {
   let matches = props.pathname.match(/^\/starlink\/(\d+)/);
   fetch(`/api/starlink?page=${matches[1]}`)
     .then(response => {
       response.json()
               .then(json => {
                 console.log(json);
                 data.value = json;
               });
     });
 });

</script>

<template>
  <main v-if="data === null">Loading Data...</main>
  <main id="starlink" v-else>
    <h2>Starlink - Page {{data.page}}</h2>
    <div class="pagin">
      <a v-for="n in data.totalPages" :href="`/starlink/${n}`" :class="n === data.page ? 'current' : ''">{{n}}</a>
    </div>
    <table>
      <tr>
        <th>#</th>
        <th>ID</th>
        <th>LONGITUDE</th>
        <th>LATITUDE</th>
        <th>HEIGHT KM</th>
        <th>VELOCITY KMS</th>
      </tr>
      <tr v-for="({id, longitude, latitude, height_km, velocity_kms}, indx) in data.data">
        <td>{{(((data.page - 1) * 200) + indx) + 1}}</td>
        <td>{{id}}</td>
        <td>{{longitude}}</td>
        <td>{{latitude}}</td>
        <td>{{height_km}}</td>
        <td>{{velocity_kms}}</td>
      </tr>
    </table>
    <div class="pagin">
      <a v-for="n in data.totalPages" :href="`/starlink/${n}`" :class="n === data.page ? 'current' : ''">{{n}}</a>
    </div>
  </main>
</template>
