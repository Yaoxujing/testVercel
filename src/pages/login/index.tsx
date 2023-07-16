// 登陆组件
import { Button, NavBar, Form, Input, Toast, InputRef } from 'antd-mobile'

import styles from './index.module.scss'
import type { LoginFormData } from '@/types/data'
import { useDispatch } from 'react-redux'
import { GetCodeAction, LoginAction } from '@/store/actions/login'
import { useHistory, useLocation } from 'react-router-dom'
import { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'


const Login = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const location : any = useLocation()
  // 1. 表单提交
  const onFinish = async (formData: LoginFormData) => {
    try {
      // store中分发一个 动作 获取这个异步动作
      // 获取到信息
      await dispatch(LoginAction(formData) as any)
      Toast.show({
        content: '登录成功',
        duration: 1000,//提示持续时间 一秒
        afterClose: () => {
          // console.log("location",location.from)
          if (location.from !== undefined) {
            // console.log("location",location)
            return history.replace(location.from)
          }
          history.replace('/home')
        },
      })
    } catch (error) {
      // const e = error as AxiosError
      Toast.show({
        // content: e.response.data.message,
        // content: e.response?.data.message,
        content: '账号密码错误',
        icon: 'fail',
      })
    }
  }

  // 2. 按钮禁用状态
  const [form] = Form.useForm()

  // 3. 发送验证码功能
  const mobileRef = useRef<InputRef>(null)
  // 表示剩余时间
  const [timeLeft, setTimeLeft] = useState(0)
  // 获取最近的timer
  const timer = useRef(0)
  const getCode = async () => {
    const mobile = form.getFieldValue('mobile')
    const isPhone = form.getFieldError('mobile')
    if (!mobile || isPhone.length > 0) {
      console.log('校验失败', mobile)
      return mobileRef.current?.focus()
    }
    try {
      await dispatch(GetCodeAction(mobile) as any)
      // 提示可有可无
      Toast.show({
        content: '发送成功',
        duration: 1000,
      })
      setTimeLeft(60)
      // 获取最新的状态 需要用箭头函数
      timer.current = window.setInterval(() => {
        setTimeLeft((timeLeft) => timeLeft - 1)
      }, 1000)
    } catch (error) {
      console.dir(error)
      const e = error as AxiosError

      Toast.show({
        // content: e.response?.data.message,
        content: '获取验证码失败',
      })
    }
  }

  const back = () =>
      history.replace('/home')

  // 清除定时器
  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timer.current)
    }
  }, [timeLeft])

  useEffect(() => {
    return () => {
      clearInterval(timer.current)
    }
  }, [])

  return (
    <div className={styles.root}>
      {/* 头部 */}
      <NavBar onBack={back}>登陆</NavBar>

      {/* 登录表单 */}
      <div className="login-form">
        <h2 className="title">账号登录</h2>

        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="mobile"
            rules={[
              { required: true, message: '请输入手机号' },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: '手机号格式错误',
              },
            ]}
            className="login-item"
          >
            <Input ref={mobileRef} placeholder="请输入手机号" />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[
              { required: true, message: '请输入验证码' },
              { len: 6, message: '验证码长度为6位' },
            ]}
            className="login-item"
            extra={
              <span
                onClick={timeLeft === 0 ? getCode : undefined}
                className="code-extra"
              >
                {timeLeft === 0 ? '发送验证码' : `还需${timeLeft}秒后重新发送`}
              </span>
            }
          >
            <Input placeholder="请输入验证码默认246810" autoComplete="off" />
          </Form.Item>

          {/* noStyle 表示不提供 Form.Item 自带的样式 */}
          <Form.Item noStyle shouldUpdate>
            {() => {
              const disabled =
                form.getFieldsError().filter((item) => item.errors.length > 0)
                  .length > 0 || !form.isFieldsTouched(true)
              return (
                <Button
                  block
                  disabled={disabled}
                  type="submit"
                  color="primary"
                  className="login-submit"
                >
                  登 录
                </Button>
              )
            }}
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default Login
