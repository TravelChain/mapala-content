<template lang="pug">
.row
  .col-md-6.centered.col-lg-6.col-xl-6.col-sm-12
    account(:account="account")
    feed
  // .col.right-fixed-container(v-if="$device.isDesktop")
  //   no-ssr
  //     mapala-map#map
  el-button(type="primary" size="small" round plain icon="el-icon-back" v-on:click ="$router.go(-1)").prev_post

</template>

<script>
import Feed from '~/components/post/Feed'
import Account from '~/components/account/Account.vue'
import { ACCOUNT_QUERY } from '~/constants/queries.js'
//import MapalaMap from '@/components/MapalaMap'

export default {
  components: {
    Feed,
    Account,
//    MapalaMap
  },

  async fetch ({ app, store, commit, route }) {
    store.dispatch('posts/set_author', route.params.account)

    if (process.server) {
      await store.dispatch('posts/fetch_posts')
    }
  },

  async asyncData({ app, route, error }) {
    let client = app.apolloProvider.defaultClient

    let { data: { account } } = await client.query({query: ACCOUNT_QUERY, variables: {
      name: route.params.account.toLowerCase()
    }})

    if (!account) return error({ statusCode: 404, message: 'Account not found' })

    return { account }
  }
}


</script>

<style>
.prev_post {
    position: fixed;
    top: 10px;
    left: 10px;
    z-index: 10000;
    /* background: url('~/assets/icon-prev.svg') no-repeat; */
    cursor: pointer;
    color: white !important;
    background: #506a8c !important;
  }
  
.card.hovercard {
    position: relative;
    padding-top: 0;
    overflow: hidden;
    text-align: center;
    background-color: #fff;
    background-color: rgba(255, 255, 255, 1);
}
.card.hovercard .card-background {
    height: 130px;
}
.card-background img {
    min-width: 100%;
    background-position: 50% 50%;
}
.card.hovercard .useravatar {
    position: absolute;
    top: 15px;
    left: 0;
    right: 0;
}
.card.hovercard .useravatar img {
    width: 100px;
    height: 100px;
    max-width: 100px;
    max-height: 100px;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    border-radius: 50%;
}
.card.hovercard .card-info .card-title {
    padding:0 5px;
    font-size: 20px;
    line-height: 1;
    color: #262626;
    border-radius: 4px;
}
</style>
