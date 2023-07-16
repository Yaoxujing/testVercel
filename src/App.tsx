import '@/App.scss'
// 配置路由
import {
  // BrowserRouter as Router,
  Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'
import Layout from './pages/layout'
import Login from './pages/login'
import Test from './pages/test'
import UserEdit from '@/pages/subpages/profile/Edit'
import customHistory from './utils/history'

import Article from '@/pages/ArticleDetail'
import Search from '@/pages/Search'
import Result from '@/pages/Search/Result'
import Chat from '@/pages/subpages/profile/Chat'
import AuthRoute from '@/components/AuthRoute'
import NotFound from '@/pages/NotFound'
function App() {
  return (
    <Router history={customHistory}>
      <div className="app">
        <Switch>
          {/* 默认组件 */}
          <Redirect exact from="/" to="/home" />
          <Route path="/home" component={Layout} />
          <Route path="/login" component={Login} />
          <Route path="/test" component={Test} />
          {/* 需要登陆才能访问 */}
          <AuthRoute path="/profile/edit" component={UserEdit} />
          <AuthRoute path="/chat" component={Chat} />
          <Route path="/article/:id" component={Article} />
          <Route exact path="/search" component={Search} />
          <Route path="/search/result" component={Result} />
          <Route component={NotFound}/>
        </Switch>
      </div>
    </Router>
  )
}

export default App
