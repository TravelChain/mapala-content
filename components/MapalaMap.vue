<template lang="pug">
div
  //gmap-autocomplete(@place_changed="setCenter"
                    :selectFirstOnEnter="true"
                    placeholder="Поиск локации").vue-map-search.form-control#search
  gmap-map(
    :options="options",
    :center="center",
    :zoom="zoom",
    @idle="updateMarkers",
    ref="mmm",
    map-type-id="terrain")

    //gmap-autocomplete(:value="editor.location.name", @place_changed="setPlace").form-control
    //gmap-autocomplete(value="asdf").form-control.search

    // :position="{lat: parseFloat(marker.location.geometry.coordinates[0]), lng:parseFloat(marker.location.geometry.coordinates[1]) }",
    //gmap-cluster(:gridSize="1")
    gmap-marker(
      v-for="marker in markers",
      :key="marker.permlink",
      :position="{lat: parseFloat(marker.position.latitude), lng:parseFloat(marker.position.longitude) }",
      :clickable="true",
      :draggable="false",
      @click="open_modal(marker)"
      @mouseover="openInfoWindow(marker, 'post')",
      @mouseout="infoWindow.opened = false",
      icon="https://mapala.net/pointer.png"
      )

    gmap-marker(
      v-for="marker in account_markers",
      :key="marker.name",
      :position="marker.coords",
      :clickable="true",
      :draggable="true",
      :icon="marker.icon"
      @click="$router.push({name: 'account', params: { account: marker.name }})"
      @mouseover="openInfoWindow(marker, 'account')",
      @mouseout="infoWindow.opened = false",
      )

    gmap-info-window(
      :options="infoWindow.options",
      :opened="infoWindow.opened",
      :content="infoWindow.content",
      :position="infoWindow.position",
      @closeclick="infoWindow.opened=false"
      )


</template>

<script>
import { map_options } from '@/config'
import gql from 'graphql-tag'
import { mapActions, mapState } from 'vuex'
import PostModal from '~/components/post/PostModal.vue'
import { ACCOUNT_MARKERS_QUERY } from '~/constants/queries.js'
import GmapCluster from 'vue2-google-maps/dist/components/cluster'


export default {
  data() {
    return {
      zoom: 6,
      center: {
        lat: -7.336642,
        lng: 112.657583
      },

      infoWindow: {
        options: {
          maxWidth: 250,
          pixelOffset: {
            width: 0,
            height: -35
          }
        },
        position: {
          lat: 0.0,
          lng: 0.0
        },
        opened: false,
        content: ''
      },

      options: map_options,

			account_markers: []
    }
  },

  async created() {
    let client = this.$apolloProvider.defaultClient

    //let { data } = await client.query({query: ACCOUNT_MARKERS_QUERY})

    // this.account_markers = data.accounts.edges.map(e => {
    //   e = e.node

    //   let avatar = e.meta.profile.profileImage || 'https://thumb.ibb.co/bHPoQz/icon_profile.png'
    //   return {
    //     name: e.name,
    //     coords: {
    //       lat: e.meta.mapalaProfile.location.geometry.coordinates[0],
    //       lng: e.meta.mapalaProfile.location.geometry.coordinates[1]
    //     },

    //     icon: 'https://imgp.golos.io/32x32/' + avatar
    //   }
    // })
  },

  computed: {
    ...mapState({
      'markers': state => state.map.markers
    })
  },

  methods: {
    ...mapActions({
      'fetch_markers': 'map/fetch_markers'
    }),

    setCenter(location) {
      if(!location.geometry) return

      this.zoom = 10
      this.center = {
        lat: location.geometry.location.lat(),
        lng: location.geometry.location.lng(),
      }
    },

    openInfoWindow (marker, type) {
      this.infoWindow.opened = true

      if (type == 'post') {
        this.infoWindow.content = `<h6>${marker.title}</h6><p>${marker.body}</p>`

        this.infoWindow.position = {
          lat: Number(marker.position.latitude),
          lng: Number(marker.position.longitude)
        }
      } else {
        this.infoWindow.content = `Здесь сейчас находится <span class="name">@${marker.name}</span>`

        this.infoWindow.position = marker.coords
      }

      this.infoWindow.options.maxWidth = 180

    },

    async open_modal(marker) {
      this.$modal.show(PostModal, {author: marker.author, permlink: marker.permlink}, {
        height: 'auto',
        width: '60%',
        scrollable: true,
        classes: ['v--modal', 'post-modal']
      })
    },

    async updateMarkers() {
      const map = this.$refs.mmm.$mapObject
      const bounds = map.getBounds()
      console.log("bounds", bounds)
      //const boundingBox = [[bounds.b.b, bounds.f.b], [bounds.b.f, bounds.f.f]]
      const boundingBox = [
        bounds.getSouthWest().lng(),
        bounds.getSouthWest().lat(),
        bounds.getNorthEast().lng(),
        bounds.getNorthEast().lat(),
        // bounds.b.b,
        // bounds.f.b,
        // bounds.b.f,
        // bounds.f.f,
      ].join()

      this.fetch_markers(boundingBox)
    }
  },

  components: {
    GmapCluster
  }
}

</script>

<style>
.vue-map-search {
    z-index: 999;
    position: absolute;
    width: 90%;
    margin: auto;
    top: 18px;
    left: 0px;
    right: 0px;
}

.name {
    font: 700 16px/20px PT Sans;
    letter-spacing: -.5px;
    color: #6d9ee1;
}
</style>
