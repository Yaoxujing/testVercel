import { Token } from '@/types/data'
import type { LoginAction } from '@/types/store'
import { getToken } from '@/utils/auth'

const initialState: Token = getToken()

export const login = (state = initialState, action: LoginAction): Token => {
  if (action.type === 'login/token') {
    return action.payload
  }
  if (action.type === 'login/logout') {
    // 清空redux
    return {}
  }
  return state
}
