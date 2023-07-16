/**
 * 全局自用自定义hooks函数
 */
import type { RootState } from '@/types/store'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useRedux = <StateName extends keyof RootState>(
  action: () => void,
  stateName: StateName
) => {
  // 1. 获取数据存到redux
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(action() as any)
  }, [])
  // 2. 获取redux数据
  const state = useSelector((state: RootState) => state[stateName])
  // 3. 返回数据
  return state
}

export { useRedux }
