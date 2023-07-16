// 这里显示的是文章的主体部分
import Icon from '@/components/icon'

import styles from './index.module.scss'
import { Popup, Tabs } from 'antd-mobile'
import { useRedux } from '@/hooks'
import { getChannelAction } from '@/store/actions/home'
import { Channel } from '@/types/data'
import Channels from './components/Channels'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import ArticleItem from '@/components/ArticleItem'
import ArticleList from './components/ArticleList'
import { useHistory } from 'react-router-dom'

const Home = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  // 1. 频道管理
  const [showChannel, setShowChannel] = useState(false)
  const openChannel = () => {
    setShowChannel(true)
  }
  const closeChannel = () => {
    setShowChannel(false)
  }
  // 获取频道以及高亮的状态
  const { userChannel, active } = useRedux(getChannelAction, 'home')

  // 2. 点击频道高亮
  const changeActive = async (id: string) => {
    await dispatch({ type: 'home/toggleChannel', payload: parseInt(id) })
  }
  return (
    <div className={styles.root}>
      {/* 频道 Tabs 列表 */}
      {/* 注意：此处别忘了添加 tabs 类名 */}
      <Tabs
        onChange={changeActive}
        activeKey={active + ''}
        className="tabs"
        activeLineMode='auto'
      >
        {userChannel.map((item: Channel) => (
          <Tabs.Tab title={item.name} key={item.id}>
            <ArticleList channelId={item.id} />
          </Tabs.Tab>
        ))}
      </Tabs>
      <div className="tabs-opration">
        {/* 搜索按钮 */}
        <Icon onClick={() => history.push('/search')} type="iconbtn_search" />
        {/* 频道编辑按钮 */}
        <Icon onClick={openChannel} type="iconbtn_channel" />
      </div>
      {/* 频道管理 */}
      <Popup className="channel-popup" visible={showChannel} position="left">
        <Channels onClose={closeChannel} />
      </Popup>
    </div>
  )
}

export default Home
