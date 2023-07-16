// 布局底部四个模块并渲染 切换子路由
import { Route, useHistory, useLocation } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import styles from './index.module.scss'

import Icon from '@/components/icon'

// 导入页面组件，配置路由
import Home from '@/pages/subpages/home'
import Question from '@/pages/subpages/question'
import Video from '@/pages/subpages/video'
import Profile from '@/pages/subpages/profile'
import AuthRoute from '@/components/AuthRoute'
import Test from '../test'

const tabs = [
  { path: '/home', icon: 'iconbtn_home', text: '首页' },
  { path: '/home/question', icon: 'iconbtn_qa', text: '问答' },
  { path: '/home/video', icon: 'iconbtn_video', text: '视频' },
  { path: '/home/profile', icon: 'iconbtn_mine', text: '我的' },
]

const Layout = () => {
  const history = useHistory()
  const location = useLocation()
  // 1. 导航栏路由切换
  const changeRoute = (path: string) => {
    history.push(path)
  }

  // 2. 刷新保持高亮状态
  // console.log(location.pathname)

  return (
    <div className={styles.root}>
      {/* 路由的地方是5 */}
      {/* 子路由位置 */}
      <Route exact path="/home" component={Home} />
      <Route path="/home/question" component={Question} />
      <Route path="/home/video" component={Video} />
      <AuthRoute path="/home/profile" component={Profile} />
      <Route path="/home/test" component={Test}/>
      
      {/* 底部导航的位置 */}
      <TabBar
        activeKey={location.pathname}
        onChange={changeRoute}
        className="tab-bar"
      >
        {tabs.map((item) => (
          <TabBar.Item
            key={item.path}
            icon={(active) => (
              <Icon
                type={active ? `${item.icon}_sel` : item.icon}
                // className="tab-bar-item-icon"
              />
            )}
            title={item.text}
          />
        ))}
      </TabBar>
    </div>
  )
}

export default Layout
