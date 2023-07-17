import { SearchResultResponse, SuggestionResponse } from '../types/data'
import request from '@/utils/request'

export function getSuggestsApi(q: string): Promise<SuggestionResponse> {
  return request.get('/suggestion', { params: { q } })
}

// 获取搜索结果列表
type ParmasSearch = {
  q: string | null // 关键词
  page: number // 第几页
}
export function getSearchList(
  parmas: ParmasSearch
): Promise<SearchResultResponse> {
  return request.get('/search', { params: parmas })
}
