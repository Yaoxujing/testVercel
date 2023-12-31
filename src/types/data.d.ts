/**
 * 接口返回类型
 */
// 后台返回数据的类型
type ApiResponse<Data> = {
  data: Data
  message: string
}

/**
 * login页面
 */
// 表单数据类型
export type LoginFormData = {
  mobile: string
  code: string
}
// 登录接口返回数据
export type Token = {
  token?: string
  refresh_token?: string
}

// 登录接口response类型
export type LoginResponse = ApiResponse<Token>

/**
 * profile页面
 */
// 2. 登录人数据
export type User = {
  id: string
  name: string
  photo: string
  art_count: number
  follow_count: number
  fans_count: number
  like_count: number
}

export type UserResponse = ApiResponse<User>

/**
 * edit页面
 */
// 3. 用户修改数据
export type UserProfile = {
  id: string
  photo: string
  name: string
  mobile: string
  gender: number
  birthday: string
  intro: string
}

export type UserProfileResponse = ApiResponse<UserProfile>

// 4. 上传头像
export type uploadResponse = ApiResponse<{ photo: string }>

/**
 * home页面
 */
// 5. 用户频道 | 所有频道
export type Channel = {
  id: number
  name: string
}

export type UserChannel = {
  channels: Channel[]
}

export type UserChannelResponse = ApiResponse<UserChannel>

// 文章列表
export type ArticlesItem = {
  art_id: string
  aut_id: string
  aut_name: string
  comm_count: number
  cover: {
    type: 0 | 1 | 3
    images: string[]
  }
  pubdate: string
  title: string
}
export type Articles = {
  pre_timestamp: number
  results: ArticlesItem[]
}
export type ArticlesResponse = ApiResponse<Articles>

/**
 * Search界面
 */
// 搜索关键词
export type Suggests = {
  options: string[]
}
export type SuggestionResponse = ApiResponse<Suggests>

/**
 * 搜索结果界面
 */
// 搜索结果
export type SearchResult = {
  page: number
  per_page: number
  total_count: number
  results: Articles['results']
}
export type SearchResultResponse = ApiResponse<SearchResult>

/**
 * 文章详情页面
 */
// -- 文章详情 --
export type ArticleDetail = {
  art_id: string
  title: string
  pubdate: string
  aut_id: string
  aut_name: string
  aut_photo: string
  is_followed: boolean
  attitude: number
  content: string
  is_collected: boolean
  // 接口中缺失
  comm_count: number
  like_count: number
  read_count: number
}
export type ArticleDetailResponse = ApiResponse<ArticleDetail>

// 评论项的类型
export type ArticleCommentItem = {
  com_id: string
  aut_id: string
  aut_name: string
  aut_photo: string
  like_count: number
  reply_count: number
  pubdate: string
  content: string
  is_liking: boolean
  is_followed: boolean
}
// 文章评论的类型
export type ArticleComment = {
  total_count: number
  end_id: string | null
  last_id: string | null
  results: ArticleCommentItem[]
}
export type ArticleCommentResponse = ApiResponse<ArticleComment>

// 文章发布评论的类型
// 注意：接口文档中的返回类型与后台接口返回数据不一致
export type AddArticleCommnet = {
  com_id: string
  new_obj: ArticleCommentItem
  target: string
}
export type AddArticleCommnetResponse = ApiResponse<AddArticleCommnet>
