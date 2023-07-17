import { ArticlesResponse } from '../types/data'
import http from '@/utils/request'

// 获取文章列表数据
type ParmasArticle = {
  channel_id: number
  timestamp: number
}
export function getArticleListApi(
  parmas: ParmasArticle
): Promise<ArticlesResponse> {
  return http.get('/articles', { params: parmas })
}
