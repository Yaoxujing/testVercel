import { uploadResponse } from '@/types/data'
import request from '@/utils/request'

// 上传头像
export function uploadPhotoApi(data: FormData): Promise<uploadResponse> {
  return request.patch('user/photo', data)
}
