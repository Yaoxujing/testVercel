import axios from 'axios'
import store from '@/store'

import customHistory from './history'
import { Toast } from 'antd-mobile'
import { clearToken, isAuth, setToken } from './auth'

// 创建axios实例
const http = axios.create({
  // baseURL: 'http://toutiao.itheima.net/v1_0',
  baseURL:'/api'

})

// 请求拦截器
http.interceptors.request.use((config) => {
  // 获取token
  
  const {
    login: { token },
  } = store.getState()
  if (token) {
    // console.log(token)
    // 添加请求头
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

// 简化后台返回数据
http.interceptors.response.use(
  (res) => {
    return res.data
  },
  // 如果出现错误 err的值有两个 一个response 一个config
  
  async (error) => {
    // 401token过期
    if (error.response.status === 401) {
      try {
        // 没有登录
        if (!isAuth) {
          throw Error(error)
        }
        // 登录过
        const { refresh_token } = store.getState().login
        // 获取刷新token的请求
        const { data } = await axios.put(
          'http://toutiao.itheima.net/v1_0/authorizations',
          null,
          {
            headers: {
              Authorization: `Bearer ${refresh_token}`,
            },
          }
        )
        // 重新获取到token存储到本地和redux中
        const newTokens = {
          token: data.data.token,
          refresh_token,
        }
        // 保存到本地中
        setToken(newTokens)
        // 保存到store中
        store.dispatch({ type: 'login/token', payload: newTokens })
        // 返回一个实例对象 url base-url 因为重新发是个promise 返回一个结果
        return http(error.config)
      } catch (error) {
        // 如果刷新token失败了
        // 退出登陆
        store.dispatch({ type: 'login/logout' })
        // 清除token
        clearToken()
        Toast.show({
          content: '登录超时，请重新登录',
          icon: 'fail',
          afterClose: () => {
            customHistory.replace({
              pathname: '/login',
              state: { from: customHistory.location.pathname },
            })
          },
        })
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default http
