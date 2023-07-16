// 这个是控制修改昵称和简介的
import { Input, NavBar, TextArea } from 'antd-mobile'

import styles from './index.module.scss'
import { useEffect, useState } from 'react'

type Props = {
  onClose: () => void
  updateUser: (type: string, data: string, close: () => void) => void
  value: string
  type: '' | 'name' | 'intro'
}

const EditInput = ({ onClose, value, updateUser, type }: Props) => {
  const [inputValue, setInputValue] = useState(value)

  // 1. 提交修改 传给父组件
  const updateName = () => {
    updateUser(type, inputValue, onClose)
  }

  // 2. 区分修改的状态
  const isName = type === 'name'

  // 3. 监控value值的变化
  useEffect(() => {
    setInputValue(value ?? '')
  }, [value])
  return (
    <div className={styles.root}>
      <NavBar
        onBack={onClose}
        className="navbar"
        right={
          <span onClick={updateName} className="commit-btn">
            提交
          </span>
        }
      >
        编辑{isName ? '昵称' : '简介'}
      </NavBar>

      <div className="edit-input-content">
        <h3>{isName ? '昵称' : '简介'}</h3>
        {/* 是昵称就是盒子，是简介就是一个文本框 */}
        {isName ? (
          <div className="input-wrap">
            <Input
              placeholder="请输入"
              value={inputValue}
              onChange={setInputValue}
            />
          </div>
        ) : (
          <TextArea
            className="textarea"
            placeholder="请输入"
            showCount
            maxLength={100}
            rows={4}
            value={inputValue}
            onChange={setInputValue}
          />
        )}
      </div>
    </div>
  )
}

export default EditInput
