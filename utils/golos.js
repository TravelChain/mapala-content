import slug from 'slug'
import axios from 'axios'
import golos from 'golos-js'
import { Signature, PrivateKey, hash } from 'golos-js/lib/auth/ecc'

import config from '@/config'


export async function createUniqPermlink(author, title) {
  // Возвращает уникальный пермлинк для поста
  let permlink = slug(title, {lower: true})

  let isExists = await golos.api.getContent(author, permlink)

  if (isExists.id !== 0) {
    const timeStr = new Date()
      .toISOString()
      .replace(/[^a-zA-Z0-9]+/g, "")
      .toLowerCase()

    permlink = `${permlink}-${timeStr}`
  }

  return permlink
}



export function prepare_json_metadata (m) {
  let meta = m

  let app_tag = config.tag_for_post // В первый тего постим
  meta.app = config.app

  if (meta.tags === undefined) {
    meta.tags = [app_tag]
  } else if (!meta.tags.includes(app_tag)) {
    meta.tags.unshift(app_tag)
  }

  return meta
}

export async function get_account(account) {
  let res
  await golos.api.getAccounts([account], (e, r) => res = r)

  return res[0]
}


// TODO Метод для смены ноды


export async function uploadImage (file, auth) {
  const username = auth.account.name
  const d = PrivateKey.fromWif(auth.wif)

  if (!username) {
    throw new Error('Please logged in first.')
  }

  if (!d) {
    throw new Error('Login with your posting key')
  }

  if (!file && !dataUrl) {
    console.error('uploadImage required: file or dataUrl')
  }

  let data, dataBs64

  if (file) {
    const reader = new FileReader()
    data = await new Promise(resolve => {
      reader.addEventListener('load', () => {
        const result = new Buffer(reader.result, 'binary')
        resolve(result)
      })
      reader.readAsBinaryString(file)
    })
  } else {
    // recover from preview
    const commaIdx = dataUrl.indexOf(',')
    dataBs64 = dataUrl.substring(commaIdx + 1)
    data = new Buffer(dataBs64, 'base64')
  }

  // The challenge needs to be prefixed with a constant (both on the server and checked on the client) to make sure the server can't easily make the client sign a transaction doing something else.
  const prefix = new Buffer('ImageSigningChallenge')
  const bufSha = hash.sha256(Buffer.concat([prefix, data]))

  const formData = new FormData()

  if(file) {
    formData.append('file', file)
  } else {
    // formData.append('file', file, filename) <- Failed to add filename=xxx to Content-Disposition
    // Can't easily make this look like a file so this relies on the server supporting: filename and filebinary
    formData.append('filename', filename)
    formData.append('filebase64', dataBs64)
  }

  const sig = Signature.signBufferSha256(bufSha, d)
  const upload_url = 'https://images.golos.io' // TODO заменять для стима/голоса
  const postUrl = `${upload_url}/${username}/${sig.toHex()}`

  const res = await axios.post(postUrl, formData, {headers: {'content-type': 'multipart/form-data'}})

  return res.data.url
}


export default golos;
