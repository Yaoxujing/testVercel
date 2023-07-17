import classnames from 'classnames'
import { useHistory } from 'react-router'
import { NavBar, SearchBar } from 'antd-mobile'

import Icon from '@/components/icon'
import styles from './index.module.scss'
import { useEffect, useState } from 'react'
import { getSuggestsApi } from '@/myapi/search'
import { useDebounceFn } from 'ahooks'
// import { debounce } from 'lodash'

// // 1. 使用loadsh进行联想词防抖
// const debounceFn = debounce(async (value: string) => {
//   // 获取联想词数据
//   const {
//     data: { options },
//   } = await getSuggestsApi(value)
// }, 600)
const SearchPage = () => {
  const history = useHistory()

  // 1. 搜索框受控
  const [keyword, setKeyWord] = useState('')
  const changeWorld = async (value: string) => {
    setKeyWord(value)
    if (!value.trim()) return setSuggests([])
    // 获取联想词数据
    // const {
    //   data: { options },
    // } = await getSuggestsApi(value)
    run(value)
  }

  // 2. 使用useDeboundeFn处理防抖
  const { run } = useDebounceFn(
    async (value: string) => {
      const {
        data: { options },
      } = await getSuggestsApi(value)
      setSuggests(
        options.map(
          (item) => item && item.replace(value, `<span>${value}</span>`)
        )
      )
    },
    { wait: 600 }
  )

  // 3. 联想词列表
  const [suggests, setSuggests] = useState<string[]>([])

  // 4. 跳转搜索结果页，携带搜索关键词
  const onSearch = (value: string) => {
    setTimeout(() => {
      history.push(`/search/result?q=${value}`)
    })
    // 存储搜索关键词
    saveHis(value)
  }

  // 5. 搜索时存储输入的关键词 -> 历史记录
  const [his, setHis] = useState<string[]>(
    JSON.parse(localStorage.getItem('his') || '[]')
  )

  // 存储
  const saveHis = (value: string) => {
    if (his.some((item) => item === value)) return
    setHis([value, ...his])
  }

  // 持久化
  useEffect(() => {
    localStorage.setItem('his', JSON.stringify(his))
  }, [his])

  // 删除单个
  const delHis = (word: string) => {
    setHis(his.filter((item) => item !== word))
  }

  // 删除全部
  const clearHis = () => {
    setHis([])
  }

  return (
    <div className={styles.root}>
      <NavBar
        className="navbar"
        onBack={() => history.go(-1)}
        right={
          <span onClick={() => onSearch(keyword)} className="search-text">
            搜索
          </span>
        }
      >
        <SearchBar
          value={keyword}
          onChange={changeWorld}
          placeholder="请输入关键字搜索"
        />
      </NavBar>

      {/* 搜索历史记录 => 用户执行搜索关键词记录 */}
      {suggests.length === 0 && his.length > 0 && (
        <div className="history">
          <div className="history-header">
            <span>搜索历史</span>
            <span>
              <Icon onClick={clearHis} type="iconbtn_del" />
              清除全部
            </span>
          </div>

          <div className="history-list">
            {his.map((item) => (
              <span
                key={item}
                onClick={() => onSearch(item)}
                className="history-item"
              >
                <span className="text-overflow">{item}</span>
                <Icon
                  onClick={(e) => {
                    e.stopPropagation()
                    delHis(item)
                  }}
                  type="iconbtn_essay_close"
                />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 搜索联想词 */}
      <div
        className={classnames('search-result', suggests.length > 0 && 'show')}
      >
        {suggests.map(
          (item) =>
            item && (
              <div
                key={item}
                className="result-item"
                onClick={() =>
                  onSearch(item.replace(`<span>${keyword}</span>`, keyword))
                }
              >
                <Icon className="icon-search" type="iconbtn_search" />
                <div
                  dangerouslySetInnerHTML={{ __html: item }}
                  className="result-value text-overflow"
                >
                  {/* <span>黑马</span> */}
                  {/* <span>{item}</span> */}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  )
}

export default SearchPage
