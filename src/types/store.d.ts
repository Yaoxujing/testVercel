import { ThunkAction } from 'redux-thunk'
import { Channel, Token, UserChannel, UserProfile } from './data'

// 1. store数据类型
export type RootState = ReturnType<typeof store.getState>

// 2. 所有action的类型
type RootAction = LoginAction | UserAction | HomeAction

// 3. 异步action函数返回值类型
export type RootThunkAction = ThunkAction<void, RootState, unknown, RootAction>

// 4. 其它模块的action类型
// login页面
export type LoginAction =
  | {
      type: 'login/token'
      payload: Token
    }
  | {
      type: 'login/logout'
    }

// profile页面
export type UserAction =
  | {
      type: 'user/get'
      payload: User
    }
  | {
      type: 'user/edit'
      payload: UserProfile
    }
  | {
      type: 'user/update'
      payload: Partial<UserProfile>
    }

// home页面
export type HomeAction =
  | {
      type: 'home/getUserChannel'
      payload: Channel[]
    }
  | {
      type: 'home/getRestChannel'
      payload: Channel[]
    }
  | {
      type: 'home/toggleChannel'
      payload: number
    }
  | {
      type: 'home/delUserChannel'
      payload: Channel
    }
  | {
      type: 'home/addChannel'
      payload: Channel
    }
