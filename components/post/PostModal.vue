<template lang="pug">
.row
  .col(v-loading="loading").loading
    post(v-if="post" :post="post").postcontent
    not-found(v-if="notFound").mt-5

    // TODO Сделать стрелки
    //a(v-if="true" class="next_post") sadf
    //a(v-if="true" class="prev_post") Back
</template>

<script>
import { mapActions } from 'vuex'
import Post from '~/components/post/Post.vue'
import NotFound from '~/components/errors/NotFound.vue'
import { POST_QUERY } from '@/constants/queries.js'

export default {
  props: ['author', 'permlink'],

  components: {
    Post,
    NotFound
  },

  data () {
    return {
      loading: false,
      notFound: false,

      post: null
    }
  },

  watch: {
    $route (to, from){
      // Закрываем модалку когда уходим куда то
      this.$emit('close')
    }
  }, 

  async created() {
    this.loading = true

    let client = this.$apolloProvider.defaultClient

    let {data: {post}} = await client.query({query: POST_QUERY, variables: {
      identifier: `@${this.author.toLowerCase()}/${this.permlink}`,
      linkifyImages: true,
      isVoted: this.$store.state.auth.account.name,
      authorized: !!this.$store.state.auth.wif
    }})

    if (!post) this.notFound = true

    this.post = JSON.parse(JSON.stringify(post))
    this.loading = false
  }
}
</script>

<style>
.loading {
  min-height: 300px;
}
  .postcontent{
    padding: 0px 20px;
  }

</style>
