import config from '~/config'
import { POSTS_QUERY } from '@/constants/queries.js'


export const state = () => ({
  list: [],

  author: undefined,
  after: undefined,
  orderby: "created_ASC",
})

export const actions = {
  async fetch_posts({ rootState, state, commit }) {
    console.log("state", state)

    let client = this.app.apolloProvider.defaultClient

    let { data } = await client.query({query: POSTS_QUERY, variables: {
      tags: [config.tag_for_post],
      first: config.pagination,
      author: state.author,
      after: state.after,
      linkifyImages: true,
      isVoted: rootState.auth.account.name,
      authorized: !!rootState.auth.isAuth,
      orderby: state.orderby
    }})

    let posts = data.posts.edges.map(p => p.node)
    console.log("new posts", posts)
    console.log("state order is: ", state.orderby)
    let posts_deep_copy = JSON.parse(JSON.stringify(posts))

    commit('set_posts', state.list.concat(posts_deep_copy))
    console.log(state.list)
    if (posts.length > 0) {
      console.log("new after:", data.posts.edges[data.posts.edges.length - 1])
      commit('set_after', data.posts.edges[data.posts.edges.length - 1].cursor)
    }
  },

  set_author({ state, commit }, author) {
    if (author !== state.author) commit('clear')
    commit('set_author', author)
  },

  set_order({state, commit}, orderby) {
    state.list = []
    state.after = undefined
    commit('set_orderby', orderby)
    console.log("new order setted")
  }
}

export const mutations = {

  set_orderby: (state, orderby) => {
    state.orderby = orderby
  },

  set_posts: (state, posts) => {
    state.list = posts
  },

  clear: (state) => {
    state.list = []
    state.after = undefined
    state.author = undefined
  },

  set_author: (state, author) => {
    state.author = author
  },

  set_after: (state, after) => {
    state.after = after
  }
}
