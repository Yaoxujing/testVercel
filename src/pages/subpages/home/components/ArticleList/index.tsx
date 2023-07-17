import { InfiniteScroll } from 'antd-mobile'
import { useRef, useState } from 'react'
// import { sleep } from 'antd-mobile/es/utils/sleep'
import ArticleItem from '@/components/ArticleItem'
import styles from './index.module.scss'
import { getArticleListApi } from '@/myapi/home'
import { ArticlesItem } from '@/types/data'
import { useHistory } from 'react-router-dom'

// 下拉刷新功能
import { PullToRefresh} from 'antd-mobile'

type Props = {
  channelId: number
}

const ArticleList = ({ channelId }: Props) => {
  const history = useHistory()

  const [data, setData] = useState<ArticlesItem[]>([])
  const [hasMore, setHasMore] = useState(true)
  const timestamp = useRef(Date.now())
  
  // 发请求
  async function loadMore() {
    // console.log("需要加载更多数据")
    // 节流已经优化了 设一个阀门
    const {
      data: { results, pre_timestamp },
    } = await getArticleListApi({
      channel_id: channelId,
      // 这是用来当前的时间戳
      timestamp: timestamp.current,
    })
    
    // 没有保存在redux里，而是保存在组件里
    // 追加
    setData((val) => [...val, ...results]) 
    if (pre_timestamp) {
      timestamp.current = pre_timestamp
    } else {
      setHasMore(false)
    }
    // console.log(results)
  }

  // 下拉刷新
  async function getFreshData() {
    setHasMore(true)
    const {
      data: { results},
    } = await getArticleListApi({
      channel_id: channelId,
      // 这是用来当前的时间戳
      timestamp: Date.now(),
    })
    // 没有保存在redux里，而是保存在组件里
    setData([...results])
  }

  return (
    <PullToRefresh
      onRefresh={getFreshData}
    >
      <div className={styles.root}>
        {/* 文章列表中的每一项 */}
        {data.map((item, index) => (
          <div
            key={item.art_id}
            className="article-item"
            onClick={() => history.push(`/article/${item.art_id}`)}
          >
            <ArticleItem type={item.cover.type} item={item} />
          </div>
        ))}
        {/*
          loadMore 加载数据的函数 上拉加载更多
          hasMore 布尔值，true 表示还有更多数据；false 表示没有更多数据了
        */}
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
      </div>
    </PullToRefresh>
  )
}

export default ArticleList
