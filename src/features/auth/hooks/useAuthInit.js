import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { restoreUserThunk } from '@features/auth/store/authThunk'

export const useAuthInit = () => {
  console.log('🟡 restoreUserThunk 호출됨') // ✅ 꼭 추가
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(restoreUserThunk())
  }, [dispatch])
}