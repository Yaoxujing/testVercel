import { Channel, UserChannel, UserChannelResponse } from '@/types/data'
import { RootThunkAction } from '@/types/store'
import request from '@/utils/request'
import _ from 'lodash'

// 获取用户频道数据
export const getChannelAction = (): RootThunkAction => {
  return async (dispatch, getState) => {
    const {
      data: { channels },
    }: UserChannelResponse = await request.get('/user/channels')

    dispatch({ type: 'home/getUserChannel', payload: channels })
  }
}

// 频道推荐 =  获取所有频道 - 我的频道
export const getAllChannelAction = (): RootThunkAction => {
  return async (dispatch, getState) => {
    const {
      data: { channels },
    }: UserChannelResponse = await request.get('/channels')
    const { userChannel } = getState().home
    const resChannels = _.differenceBy(channels, userChannel, 'id')
    dispatch({ type: 'home/getRestChannel', payload: resChannels })
  }
}

// 删除用户频道
export const delUserChannelAction = (payload: Channel): RootThunkAction => {
  return async (dispatch, getState) => {
    await request.delete(`/user/channels/${payload.id}`)
    dispatch({ type: 'home/delUserChannel', payload })
  }
}

// 新增频道
export const addChannel = (channel: Channel): RootThunkAction => {
  return async (dispatch, getState) => {
    await request.patch('/user/channels', { channels: [channel] })
    dispatch({ type: 'home/addChannel', payload: channel })
  }
}
