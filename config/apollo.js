import { ApolloLink } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import config from '@/config'

export default (ctx) => {
  const httpLink = new HttpLink({ uri: config.API_QL_URL })
  // middleware
  //const middlewareLink = new ApolloLink((operation, forward) => {
  //  //This function is called before every request. Update ctx.req.session and window.__NUXT__.state.session
  //  //To point to wherever you store your token
  //  const token = process.server ? ctx.req.session : window.__NUXT__.state.session

  //  operation.setContext({
  //    headers: { authorization: `Bearer ${token}` }
  //  })
  //  return forward(operation)
  //})
  const link = httpLink

  return {
    link,
    cache: new InMemoryCache()
  }
}
