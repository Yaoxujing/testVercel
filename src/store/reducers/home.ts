import { Channel } from '@/types/data'
import { HomeAction } from '@/types/store'

type Init = {
  userChannel: Channel[]
  restChannel: Channel[]
  active: number
}

const initialState: Init = {
  userChannel: [], // 用户频道
  restChannel: [], // 频带推荐
  active: 0, // 选中频道的ID
}

export const home = (state = initialState, action: HomeAction): Init => {
  // 用户频道
  if (action.type === 'home/getUserChannel') {
    return {
      ...state,
      userChannel: action.payload,
    }
  }
  // 获取可选频道
  if (action.type === 'home/getRestChannel') {
    return {
      ...state,
      restChannel: action.payload,
    }
  }

  // 高亮
  if (action.type === 'home/toggleChannel') {
    return {
      ...state,
      active: action.payload,
    }
  }
  // 删除频道
  if (action.type === 'home/delUserChannel') {
    return {
      ...state,
      userChannel: state.userChannel.filter(
        (item) => item.id !== action.payload.id
      ),
      restChannel: [action.payload, ...state.restChannel],
    }
  }
  // 新增频道
  if (action.type === 'home/addChannel') {
    return {
      ...state,
      userChannel: [...state.userChannel, action.payload],
      restChannel: state.restChannel.filter(
        (item) => item.id !== action.payload.id
      ),
    }
  }
  return state
}
