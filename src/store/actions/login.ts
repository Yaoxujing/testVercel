import type { LoginFormData, LoginResponse, Token } from '@/types/data'
import { RootThunkAction } from '@/types/store'
import { clearToken, setToken } from '@/utils/auth'
import request from '@/utils/request'

// 登录
export const LoginAction = (data: LoginFormData): RootThunkAction => {
  return async (dispatch, getState) => {
    const res: LoginResponse = await request.post('authorizations', data)
    // 存本地
    setToken(res.data)
    // 存redux
    dispatch({ type: 'login/token', payload: res.data })
  }
}

// 发送验证码
export const GetCodeAction = (mobile: string): RootThunkAction => {
  return async (dispatch, getState) => {
    await request.get(`/sms/codes/${mobile}`)
  }
}

// 退出
export const logoutAction = (): RootThunkAction => {
  return async (dispatch, getState) => {
    dispatch({ type: 'login/logout' })
    clearToken()
  }
}
