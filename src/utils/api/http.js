import axios from 'axios'
import config from '../../config'
import router from '../../router'
import { Message } from 'element-ui'

axios.defaults.baseURL = config.serverUrl

class HTTPUtil {
  static async request(url, params = {}, method = 'get') {
    const storage = window.localStorage
    let sign = storage.getItem('sign')
    sign = sign ? JSON.parse(sign) : ''
    if (sign) {
      // console.log("sign:", sign)
      params = { ...sign, ...params }
    }
    if (method === 'get') {
      params = { params: params }
    }
    let response = await axios[method](url, params).catch(function(error) {
      console.log('http request error:', error)
    })
    if (response && response.status === 200) {
      response = response.data
      if (response && response.code === 200) {
        return response.data || true
      } else {
        if (response.msg === 'sign error') {
          await router.push('/')
        }
        Message.warning(response.msg)
      }
    } else {
      Message.warning(response.msg)
    }
    return ''
  }

  static async get(params = {}, url) {
    return await HTTPUtil.request(url, params, 'get')
  }

  static async post(params = {}, url) {
    return await HTTPUtil.request(url, params, 'post')
  }
}

export default HTTPUtil
