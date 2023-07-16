// 这个是用来保存对象到本地的

import { Token } from '@/types/data'
// import {Channel} from '@/types/data'
const TOKEN_KEY: string = 'geek-h5-token'
// const CHANNEL_KEY: string = 'geek-h5-channels'

// 取
const getToken = (): Token => JSON.parse(localStorage.getItem(TOKEN_KEY) ?? '{}')

// 存
const setToken = (token: Token): void =>
  localStorage.setItem(TOKEN_KEY, JSON.stringify(token))

// 清
const clearToken = () => localStorage.removeItem(TOKEN_KEY)

// 是否登录 把任意类型的值转化为false
const isAuth = () => !!getToken().token

// // 保存频道数据到本地
// const setLocalChannels = (channel: Channel): void => {
//   localStorage.setItem(CHANNEL_KEY, JSON.stringify(channel))
// }

// // 获取
// const getLocalChannels = (): Channel => JSON.parse(localStorage.getItem(CHANNEL_KEY) ?? '[]')

// // 
// const clearLocalChannels= () => localStorage.removeItem(CHANNEL_KEY)

export { isAuth, getToken, setToken, clearToken }
