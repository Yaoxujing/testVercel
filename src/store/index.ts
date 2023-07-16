// 创建store
import reducer from './reducers'

import { composeWithDevTools } from 'redux-devtools-extension'
// 创建redux  applyMiddleware应用上基于redux的中间件
import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
export default store
