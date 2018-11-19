<template lang="pug">
div
  .top(v-if="$store.state.showTop")
    .fixed-top
      nav-bar

  modals-container 

  .container-fluid.main
    nuxt

</template>

<script>

import NavBar from '@/components/NavBar'
import WelcomeBanner from '@/components/WelcomeBanner.vue'
//import MapalaMap from '@/components/MapalaMap'

export default {
  head: {
    bodyAttrs: {
      //class: 'page-top fixed-nav sticky-footer bg-dark'
    }
  },
  components: {
    NavBar,
    WelcomeBanner,
    //MapalaMap
  }
}
</script>

<style>
.top {
  /* margin-top: 60px; */
}

.main {
  margin-top: 95px;
}

.modal-wrapper {
  border-radius: 6px;
  background-color: #fff;
  -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  border: 1px solid rgba(72,84,101,.2);
  width: 100%;
  margin: 0 auto 80px;
  position: relative;
}

#map {
  height: calc(100vh - 65px);

  border-radius: 6px;
  -webkit-box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  box-shadow: 0 0 10px 0 rgba(0,0,0,.1);
  z-index: 10;
  overflow: hidden;
}
.right-fixed-container {
  padding-left: 0px;
  top: 60px;
  position: sticky;
  height: calc(100vh - 116px);
}
.centered{
  margin-left: auto;
  margin-right: auto;

}



  body {
    overflow-y:scroll;
  }

  body::-webkit-scrollbar {
    width: 0.5em;
  }
   
  body::-webkit-scrollbar-track {
      -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
  }
   
  body::-webkit-scrollbar-thumb {
    background-color: darkslategrey;
    outline: 1px solid slategrey;
  }

</style>
