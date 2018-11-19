<template lang="pug">
.row
  .container
    el-button(type="primary" size="small" class="btnback" round plain icon="el-icon-back" v-on:click ="$router.go(-1)").prev_post
    post(:post="post")

    
    
</template>

<script>
import Post from '~/components/post/Post.vue'
import { POST_QUERY } from '@/constants/queries.js'


export default {
  //layout: 'full-width',
  scrollToTop: true,

  components: {
    Post
  },

  async asyncData ({ store, route, error, app }) {
    let client = app.apolloProvider.defaultClient

    let { author, permlink } = route.params

    let {data: {post}} = await client.query({query: POST_QUERY, variables: {
      identifier: `@${author.toLowerCase()}/${permlink}`,
      linkifyImages: true,
      isVoted: store.state.auth.account.name,
      authorized: !!store.state.auth.wif
    }})

    if (!post) return error({ statusCode: 404, message: 'Публикация не найдена' })

    return { post }
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
  .btn_back{

  }

</style>