<template lang="pug">
// FIXME При возвращении на ленту, не сохраняется место скрола
// TODO В ленту подгружать не полные посты полный пост только в модалке или странице
// Скорее всего решится proxy в 1.6 vue
    
div
  .sort_buttons
    el-button(type="warning" size="small"  plain icon="el-icon-arrow-up" v-on:click ="change_order('created_ASC')").black-text.btn.about Новое
    el-button(type="warning" size="small"  plain icon="el-icon-arrow-down" v-on:click ="change_order('total_payout_value_ASC')").black-text.btn.about Топ выплат

  post-item(v-loading="loading" v-for="post in posts", :post="post", :key="post.id")

  no-ssr
    infinite-loading(@infinite="handleLoading", :distance="200", force-use-infinite-wrapper="true")
      p(slot="no-more") Больше нет постов :(
</template>

<script>
import { mapState, mapActions } from 'vuex'

import PostItem from '@/components/post/PostItem'


export default {
  data () {
    return {
      totalPayout: 0,
      loading: false
    }
  },

  created() {
    
  },
  computed: {
    ...mapState({
      posts: state => state.posts.list
    })
  },
  methods: {
    ...mapActions({
      fetch_posts: 'posts/fetch_posts',
      set_orderby: 'posts/set_order'
    }),

    change_order(orderby){
      this.loading = true
      this.set_orderby(orderby)

      this.fetch_posts().then(()=>{
        this.loading = false
      }).catch(e => {
        this.loading = false
        console.log('Request error', e)})
    },

    handleLoading($state) {
      const posts_count = this.posts.length

      this.fetch_posts().then(() => {
        if (posts_count == this.posts.length) {
          $state.complete()
        } else {
          $state.loaded()
        }
      }).catch(e => {
        console.log('Request error', e)
        setTimeout(() => $state.loaded(), 1000)
      })
    }
  },

  components: {
    PostItem,
  }
}

</script>

<style>
.sort_buttons{
  text-align: center;
  padding-bottom: 10px;
}
.fullwidth{
  width: 100%;
  display: grid;
}
.info_buttons{


  text-align: center;
  color: black;
}
.info_buttons a{
  color:black;
}
</style>