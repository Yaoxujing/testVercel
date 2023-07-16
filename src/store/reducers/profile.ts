import { User, UserProfile } from '@/types/data'
import { UserAction } from '@/types/store'

// 初始化 格式
type InitialState = {
  user: User
  edit: UserProfile
}

const initialState = {
  user: {},
  edit: {},
} as InitialState

export const profile = (
  state = initialState,
  action: UserAction
): InitialState => {
  if (action.type === 'user/get') {
    return {
      ...state,
      // 就是user等于action.data
      user: action.payload,
    }
  }
  if (action.type === 'user/edit') {
    return {
      ...state,
      edit: action.payload,
    }
  }
  if (action.type === 'user/update') {
    return {
      ...state,
      edit: {
        ...state.edit,
        ...action.payload,
      },
    }
  }
  return state
}
