import React, { useEffect, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
export default function NotFound() {
    const history = useHistory()
    const [time, setTime] = useState(3)
    useEffect(() => {
        let timer = setTimeout(() => {
            setTime(time-1)    
        }, 1000)
        // 有问题因为在闭包里面没有变化
        if (time === 0) {
            clearInterval(timer)
            history.push('/home')
        }
    },[time,history])
  return (
      <div>
          <h1>对不起，你访问的页面不存在!</h1>
          <p>
              {time}秒后。返回<Link to ='/hone'>首页</Link>
          </p>
    </div>
  )
}
