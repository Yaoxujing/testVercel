// 这是文章详情页
import { NavBar, InfiniteScroll, Popup, Toast } from 'antd-mobile'
import { useHistory, useParams } from 'react-router-dom'
import classNames from 'classnames'
import styles from './index.module.scss'

import Icon from '@/components/icon'
import CommentItem from './components/CommentItem'
import CommentFooter from './components/CommentFooter'
import { useEffect, useRef, useState } from 'react'
import {
  addComment,
  fav,
  follow,
  getArticleDetail,
  getComments,
  like,
  likeComment,
  unFav,
  unFollow,
  unLike,
  unLikeComment,
} from '@/myApi/article'
import { ArticleCommentItem, ArticleDetail } from '@/types/data'
import { formatTime } from '@/utils/time'
import check from 'dompurify'
import 'highlight.js/styles/dark.css'
import ContentLoader from 'react-content-loader'
import NoneComment from '@/components/NoneComment'
import CommentInput from '@/components/CommentInput'

// 使用枚举类型来指定评论类型
enum CommentType {
  Comment = 'a',
  reply = 'c',
}

const Article = () => {
  const history = useHistory()
  // 1. 获取文章详情数据
  const { id } = useParams<{ id: string }>()
  // 2. 文章详情数据
  const [detail, setDetail] = useState<ArticleDetail>({} as ArticleDetail)
  useEffect(() => {
    const getDetail = async () => {
      const { data } = await getArticleDetail(id)
      // console.log(data)
      setDetail(data)
      setLoading(false)
    }
    getDetail()
  }, [])

  // 3. 点击评论滚动到评论区域
  const wrapperRef = useRef<HTMLDivElement>(null)
  const commentRef = useRef<HTMLDivElement>(null)
  const isShowComment = useRef(false)
  const onCommentShow = () => {
    const wrapper = wrapperRef.current
    const comment = commentRef.current
    if (!wrapper || !comment) return
    if (!isShowComment.current) {
      wrapper.scrollTo({
        top: wrapper.scrollTop + comment.getBoundingClientRect().top - 45,
        behavior: 'smooth',
      })
      isShowComment.current = true
    } else {
      wrapper.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      isShowComment.current = false
    }
  }

  // 4. 关注作者
  const onFollow = async () => {
    if (detail.is_followed) {
      // 取关
      unFollow(detail.aut_id)
      setDetail({ ...detail, is_followed: false })
    } else {
      // 关注
      follow(detail.aut_id)
      setDetail({ ...detail, is_followed: true })
    }
  }

  // 5. 收藏
  const onFav = async () => {
    if (detail.is_collected) {
      await unFav(detail.art_id)
      setDetail({ ...detail, is_collected: false })
    } else {
      await fav(detail.art_id)
      setDetail({ ...detail, is_collected: true })
    }
  }

  // 6. 点赞
  const onLike = async () => {
    if (detail.attitude === -1) {
      await like(detail.art_id)
      setDetail({ ...detail, attitude: 1 })
    } else {
      await unLike(detail.art_id)
      setDetail({ ...detail, attitude: -1 })
    }
  }

  // 7.获取文章评论数据
  const [commentList, setCommentList] = useState<ArticleCommentItem[]>([])
  const [hasMore, setHasMore] = useState(true)
  const offset = useRef<string | null>(null)
  const loadMoreComments = async () => {
    const {
      data: { results, total_count, last_id },
    } = await getComments(CommentType.Comment, detail.art_id, offset.current)
    setCommentList([...commentList, ...results])
    if (commentList.length === total_count) {
      setHasMore(false)
    } else {
      offset.current = last_id
    }
  }

  // 8. 发表评论
  const [commentShow, setCommentShow] = useState(false)
  const openComment = () => setCommentShow(true)
  const closeComment = () => setCommentShow(false)
  // 准备弹层
  const renderCommentPopup = () => {
    return (
      <Popup
        visible={commentShow}
        position="bottom"
        bodyStyle={{ height: '50vh' }}
        onMaskClick={closeComment}
      >
        <CommentInput onClose={closeComment} onAddComment={onAddComment} />
      </Popup>
    )
  }

  // 发表评论
  const onAddComment = async (content: string) => {
    const { data } = await addComment({ target: detail.art_id, content })
    commentList.length > 0 && setCommentList([data.new_obj, ...commentList])
    setDetail({ ...detail, comm_count: detail.comm_count + 1 })
    Toast.show({
      content: '评论成功',
    })
    closeComment()
  }

  // 对评论点赞
  const onLikeComment = async (com_id: string, is_liking: boolean) => {
    if (is_liking) {
      await unLikeComment(com_id)
    } else {
      await likeComment(com_id)
    }

    const newList = commentList.map((item) => {
      if (item.com_id === com_id) {
        return {
          ...item,
          is_liking: !item.is_liking,
          like_count: item.like_count + (!is_liking ? 1 : -1),
        }
      }
      return item
    })
    setCommentList(newList)
  }

  // 专门渲染文章内容的函数
  const renderArticle = () => {
    // 文章详情
    return (
      // 1. 可滚动的内容区域
      <div className="wrapper" ref={wrapperRef}>
        <div className="article-wrapper">
          {/* 文章作者信息 */}
          <div className="header">
            <h1 className="title">{detail.title}</h1>

            {/* 文章评论 */}
            <div className="info">
              <span>{detail.pubdate}</span>
              <span>{detail.read_count} 阅读</span>
              <span>{detail.comm_count} 评论</span>
            </div>

            {/* 文章基本信息 */}
            <div className="author">
              <img src={detail.aut_photo} alt="" />
              <span className="name">{detail.aut_name ==="黑马程序员(改不了)"?"程序猿":detail.aut_name}</span>
              <span
                onClick={onFollow}
                className={classNames(
                  'follow',
                  detail.is_followed ? 'followed' : ''
                )}
              >
                {detail.is_followed ? '已关注' : '关注'}
              </span>
            </div>
          </div>

          {/* 文章内容 */}
          <div className="content">
            <div
              className="content-html dg-html"
              dangerouslySetInnerHTML={{
                __html: check.sanitize(detail.content),
              }}
            />
            <div className="date">
              发布文章时间：{formatTime(detail.pubdate)}
            </div>
          </div>
        </div>

        {/* 文章评论 */}
        {/* 滚动目标位置 */}
        <div className="comment" ref={commentRef}>
          <div className="comment-header">
            <span>全部评论（{detail.comm_count}）</span>
            <span>{detail.like_count} 点赞</span>
          </div>

          {detail.comm_count === 0 ? (
            <NoneComment />
          ) : (
            <div className="comment-list">
              {commentList.map((item) => (
                <CommentItem
                  onLikeComment={() =>
                    onLikeComment(item.com_id, item.is_liking)
                  }
                  onLike={onLike}
                  key={item.com_id}
                  {...item}
                />
              ))}

              <InfiniteScroll hasMore={hasMore} loadMore={loadMoreComments} />
            </div>
          )}
        </div>
      </div>
    )
  }

  // loading加载
  const [loading, setLoading] = useState(true)
  if (loading) {
    return (
      // 根据当前页面结构，设计好的 loading 效果
      <ContentLoader
        speed={2}
        width={375}
        height={230}
        viewBox="0 0 375 230"
        backgroundColor="#f3f3f3"
        foregroundColor="#ecebeb"
      >
        <rect x="16" y="8" rx="3" ry="3" width="340" height="10" />
        <rect x="16" y="26" rx="0" ry="0" width="70" height="6" />
        <rect x="96" y="26" rx="0" ry="0" width="50" height="6" />
        <rect x="156" y="26" rx="0" ry="0" width="50" height="6" />
        <circle cx="33" cy="69" r="17" />
        <rect x="60" y="65" rx="0" ry="0" width="45" height="6" />
        <rect x="304" y="65" rx="0" ry="0" width="52" height="6" />
        <rect x="16" y="114" rx="0" ry="0" width="340" height="15" />
        <rect x="263" y="208" rx="0" ry="0" width="94" height="19" />
        <rect x="16" y="141" rx="0" ry="0" width="340" height="15" />
        <rect x="16" y="166" rx="0" ry="0" width="340" height="15" />
      </ContentLoader>
    )
  }
  return (
    <div className={styles.root}>
      <div className="root-wrapper">
        {/* 详情头部 */}
        <NavBar
          onBack={() => history.go(-1)}
          right={
            <span>
              <Icon type="icongengduo" />
            </span>
          }
        >
          {detail && (
            <div className="nav-author">
              <img src={detail.aut_photo} alt="" />
              <span className="name">{detail.aut_name ==="黑马程序员(改不了)"?"程序猿":detail.aut_name}</span>
              <span
                onClick={onFollow}
                className={classNames(
                  'follow',
                  detail.is_followed ? 'followed' : ''
                )}
              >
                {detail.is_followed ? '已关注' : '关注'}
              </span>
            </div>
          )}
        </NavBar>
        {/* 文章详情和评论 */}
        {renderArticle()}

        {/* 底部评论栏 */}
        <CommentFooter
          openComment={openComment}
          onCommentShow={onCommentShow}
          onFav={onFav}
          isFav={detail.is_collected}
          onLike={onLike}
          attitude={detail.attitude}
          comm_count={detail.comm_count}
        />
      </div>
      {/* 发表评论弹层 */}
      {renderCommentPopup()}
    </div>
  )
}

export default Article
