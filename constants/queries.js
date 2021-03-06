import gql from 'graphql-tag'


export const MAPALA_TOTAL_PAYOUT_QUERY = gql`
{
  stats {
    posts {
      totalPayout(category: "mapala")
    }
  }
}
`


export const ACCOUNT_MARKERS_QUERY = gql`
{
  accounts(meta: {notNull: "mapalaProfile.location"}) {
    edges {
      node {
      	name
        meta {
          profile {
            profileImage
          }
          mapalaProfile {
            location {
              geometry {
                coordinates
              }
            }
          }
        }
      }
    }
  }
}
`

export const ACCOUNT_QUERY = gql`
query account($name: String!) {
  account(name: $name) {
    name,
    balanceValue
    jsonMetadata
    meta {
      mapalaProfile {
        location {
          properties
        }
      }
      profile {
        profileImage
        coverImage
        website
      }
    }
  }
}
`

export const MINIMAL_POST_QUERY = gql`
query minimal_post ($identifier: CommentIdentifier!) {
	post(identifier: $identifier) {
    title
    body
    meta {
      tags
      format
    }
  }
}
`

export const POST_QUERY = gql`
query post ($identifier: CommentIdentifier!,
            $linkifyImages: Boolean,
            $isVoted: String,
            $authorized: Boolean!)
{
  post(identifier: $identifier) {
    author {
      name
      meta {
        profile {
          profileImage
        }
      }
    }
    permlink
    meta {
      location
      format
      tags
    }
    title
    created
    body(linkifyImages: $linkifyImages)
    thumb
    isVoted(account: $isVoted)  @include(if: $authorized)
    netVotes
    totalPendingPayout
    children
    comments {
      permlink
      parentPermlink
      parentAuthor
      created
      body
      totalPendingPayout
      author {
        name
        meta {
          profile {
            profileImage
          }
        }
      }
    }
  }
}
`

export const POSTS_QUERY = gql`
query posts ($after: String,
             $category: String,
             $first: Int!,
             $author: String,
             $isVoted: String,
             $authorized: Boolean!,
             $tags: [String],
             $app: String,
             $orderby: PostOrderingEnum 
             )
{
  posts(after: $after,
        first: $first,
        category: $category,
        orderBy: $orderby,
        author: $author,
        meta: {
          tags: $tags,
          app: $app
        },

      ),

  {
    edges {
      node {
        author {
          name
          meta {
            profile {
              profileImage
            }
          }
        }
        permlink
        meta {
          location
          format
          tags
        }
        title
        created
        body
        thumb
        isVoted(account: $isVoted)  @include(if: $authorized)
        netVotes
        totalPendingPayout
        children
        comments {
          permlink
          parentPermlink
          parentAuthor
          created
          body
          totalPendingPayout
          author {
            name
            meta {
              profile {
                profileImage
              }
            }
          }
        }
      },
      cursor
    }
  }
}
`
