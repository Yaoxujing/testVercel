import { Input, NavBar } from 'antd-mobile'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'
import Icon from '@/components/icon'
import styles from './index.module.scss'
import { useEffect, useRef, useState } from 'react'
import { useSelector ,useDispatch} from 'react-redux'
import { RootState } from '@/types/store'
import { io, Socket } from 'socket.io-client'
import { getUserAction } from '@/store/actions/profile'

type Chat = {
  type: 'xz' | 'user'
  msg: string
}

const Chats = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  // 1. 小智聊天列表数据
  const [chatList, setChatList] = useState<Chat[]>([])

  // 聊天内容状态
  const [msg, setMsg] = useState('')

  const { photo } = useSelector((state: RootState) => state.profile.user)
  const { token } = useSelector((state: RootState) => state.login)

  const wsRef = useRef<Socket>()

  // 2. 建立ws连接，得到ws实例
  useEffect(() => {
    // 获取用户信息
    dispatch(getUserAction() as any)

    const ws = io('http://toutiao.itheima.net', {
      query: {
        token,
      },
      transports: ['websocket'],
    })
    wsRef.current = ws
    // 连接成功的操作
    ws.on('connect', () => {
      console.log('建立成功！')
      // 新增两条消息
      setChatList((chatList) => [
        ...chatList,
        { type: 'xz', msg: 'hello,我是小智' },
        { type: 'xz', msg: '您有什么问题要问呢？' },
      ])
      // 接收消息
      ws.on('message', (data) => {
        setChatList((chatList) => [
          ...chatList,
          {
            type: 'xz',
            msg: data.msg,
          },
        ])
      })
    })
    // 销毁组建的时候关闭连接
    return () => {
      ws.close()
    }
  }, [])

  // 3. 发送信息
  const sendMsg = () => {
    if (!msg.trim()) return
    // 发送消息
    wsRef.current?.emit('message', {
      msg,
      timestamp: Date.now(),
    })
    setChatList([
      ...chatList,
      {
        type: 'user',
        msg,
      },
    ])

    setMsg('')
  }

  // 聊天内容的滚动
  const listRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const listDom = listRef.current
    if (!listDom) return
    // 只要大于盒子就行 只能滚到最下面
    listDom.scrollTop = listDom?.scrollHeight
  }, [chatList])

  return (
    <div className={styles.root}>
      <NavBar className="fixed-header" onBack={() => history.go(-1)}>
        小智同学
      </NavBar>

      {/* 小智聊天列表 */}
      <div className="chat-list" ref={listRef}>
        {/* self是小智的类名 user是用户类名 */}
        {chatList.map((item, i) => (
          <div
            key={i}
            className={classnames(
              'chat-item',
              item.type === 'xz' ? 'self' : 'user'
            )}
          >
            {item.type === 'xz' ? (
              <Icon type="iconbtn_xiaozhitongxue" />
            ) : (
              <img
                // src={photo || 'http://geek.itheima.net/images/user_head.jpg'}
                src={photo }
                alt=""
              />
            )}
            <div className="message">{item.msg}</div>
          </div>
        ))}
        {/* <div className={classnames('chat-item', true ? 'self' : 'user')}>
          {true ? (
            <Icon type="iconbtn_xiaozhitongxue" />
          ) : (
            <img src="http://geek.itheima.net/images/user_head.jpg" alt="" />
          )}
          <div className="message">你好，我是小智</div>
        </div> */}
      </div>

      {/* 聊天内容发送-输入框 */}
      <div className="input-footer">
        <Input
          value={msg}
          onChange={setMsg}
          className="no-border"
          placeholder="请描述您的问题"
          onEnterPress={sendMsg}
        />
        <Icon type="iconbianji" />
      </div>
    </div>
  )
}

export default Chats
