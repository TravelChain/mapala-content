<template lang="pug">
.bottom-block
  //a(v-if="$device.isDesktop" @click="open_modal").icon.comment {{ post.children }}
  //nuxt-link(v-else :to="{name: 'post', params: {author: post.author.name, permlink: post.permlink}}").icon.comment {{ post.children }}

  //a.icon.repost(@click="share()") _

  el-button(@click="share()" plain type="warning" size="small" icon="el-icon-view") Поделиться

  router-link(:to="{name: 'post', params: {author: post.author.name, permlink: post.permlink}}")
    el-button(v-if="$device.isDesktop && $route.name != 'post'" plain type="success" size="small" icon="el-icon-view" :to="{name: 'post', params: {author: post.author.name, permlink: post.permlink}}") Просмотреть

  
  upvote-button(:post="post")

  no-ssr
    textarea(ref="copy_clickboard").copy-clickboard

</template>

<script>
import config from '~/config'
import UpvoteButton from '~/components/post/UpvoteButton.vue'


export default {
  props: ['post'],

  components: {
    UpvoteButton,
  },

  methods: {
    open_modal() {
      this.$modal.show(PostModal, { author: this.post.author.name, permlink: this.post.permlink }, {
        height: 'auto',
        width: '60%',
        scrollable: true,
        classes: ['v--modal', 'post-modal']
      })
    },

    share() {
      // TODO Вынести домен в конфиг
      this.$copyText(`${config.baseURI}@${this.post.author.name}/${this.post.permlink}`)
      this.$message('Сылка на публикацию скопированна в буфер обмена')
    }
  }
}
</script>

<style>
.bottom-block {
  padding-left: 17px;
  padding-right: 17px;
  padding-bottom: 8px;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  text-align: center;
}

.copy-clickboard {
  position: absolute;
  left: -9999px
}

.bottom-block .icons {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}
</style>
