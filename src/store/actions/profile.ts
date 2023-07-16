import { UserProfile, UserProfileResponse, UserResponse } from '@/types/data'
import { RootThunkAction } from '@/types/store'
import request from '@/utils/request'

// 获取登录人数据
export const getUserAction = (): RootThunkAction => {
  return async (dispatch, getState) => {
    const res: UserResponse = await request.get('/user')
    // 这些为了防止写错可以设置为常量 type: 'user/get' 但我懒得
    dispatch({ type: 'user/get', payload: res.data })
  }
}

// 获取登录人修改数据
export const getUserEditAction = (): RootThunkAction => {
  return async (dispatch, getState) => {
    const res: UserProfileResponse = await request.get('/user/profile')
    dispatch({ type: 'user/edit', payload: res.data })
  }
}

// 修改登录人信息
export const updateUserAction = (
  user: Partial<UserProfile>
): RootThunkAction => {
  return async (dispatch, getState) => {
    await request.patch('/user/profile', user)
    dispatch({ type: 'user/update', payload: user })
  }
}
