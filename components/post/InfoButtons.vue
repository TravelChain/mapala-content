<template lang="pug">
div.fullwidth
	.info_buttons
		nuxt-link(:to="{name: 'about'}").black-text.btn.about Выплачено: {{ totalPayout | convertGBG }} ₽
		
		nuxt-link(:to="{name: 'about'}").black-text.btn.about Вопросы и ответы [FAQ]

</template>

<script>
import { MAPALA_TOTAL_PAYOUT_QUERY } from '~/constants/queries'

export default {
  created(){
  	let client = this.$apolloProvider.defaultClient

    client.query({query: MAPALA_TOTAL_PAYOUT_QUERY})
      //.then(r => console.log(r.data.stats * 2.60424))
      .then(r => this.totalPayout = r.data.stats.posts.totalPayout)
  },
  data () {
    return {
    	totalPayout: 0,
    }
  },
  components: {
    
  }
}

</script>

<style>
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