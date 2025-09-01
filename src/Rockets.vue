<script setup>
 import {ref, watchEffect} from "vue";

 const data = ref(null);
 const current = ref(null);

 const props = defineProps({
   pathname:String,
   onClick:Function
 });

 setCurrent = () => {
   let matches = props.pathname.match(/^\/rockets(?:\/(.*)|)/)
   current.value = matches[1] === undefined ? null : data.value.data.filter(({id}) => id === matches[1])[0] || null;
 }

 fetch("/api/rockets")
   .then(response => {
     response.json()
             .then(json => {
               console.log(json);
               data.value = json;
               watchEffect(() => setCurrent());
             });
   });
</script>

<template>
  <main v-if="data === null">Loading Data...</main>
  <main id="rocket-details" v-else-if="current !== null">
    <h2>Rockets - {{current.name}}</h2>
    <p v-for="([key, txt]) in [['company', 'Company'], ['country', 'Country'], ['first_flight', 'First Flight']]" key="key">
      <strong>{{txt}}: </strong><span>{{current[key]}}</span>
    </p>
    <p>{{current.description}}</p>
    <p class="launches"><a @click="onClick" :href="`/launches/${current.id}`">{{current.name}} Launches</a></p>
    <div class="photos">
      <a v-for="src in current.flickr_images" target="_blank" :href="src">
        <img width="auto" height="160" :src="src" />
      </a>
    </div>
  </main>
  <main id="rockets" v-else>
    <h2>Rockets</h2>
    <div>
      <div v-for="(item, indx) in data.data" :key="indx">
        <h3>{{item.name}}</h3>
        <img width="256" height="256" :src="item.flickr_images[0]" />
        <a @click="onClick" :href="`/rockets/${item.id}`">Click for Details</a>
      </div>
    </div>
  </main>
</template>
