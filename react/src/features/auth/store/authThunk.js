import { createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '../services/authService'
import { setUser, setLoading, setError, clearAuth, setWarning } from './authSlice'
import { ApiError } from '../../../shared/errors/ApiError'
import { checkSubStatThunk, fetchSubDetailsThunk } from '../../subscription/store/subscriptionThunk'
import { resetSubscriptionState } from '../../subscription/store/subscriptionSlice'
import { message } from 'antd'

export const loginThunk = createAsyncThunk(
  'auth/login',
  async ( credentials, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true))
      const { user, message } =await authService.loginService(credentials)
      if (message) {
        dispatch(setWarning(message))
      }
      dispatch(setUser(user))
      return user
    } catch (err) {
      // ApiError로 넘어온 경우
      if (err instanceof ApiError) {
        // inactive계정
        if (err.code === 'ACCOUNT_INACTIVE') {
          return rejectWithValue({code:'ACCOUNT_INACTIVE', message: err.message})
        }
        return rejectWithValue({code: err.code, message: err.message})
      }
      // 그외 일반 에러
      const msg = err?.message || '로그인 실패'
      dispatch(setError(msg))
      return rejectWithValue({code: '', message: msg})
    } finally {
      dispatch(setLoading(false))
    }
  }
)
// export const loginThunk = createAsyncThunk(
//   'auth/login',
//   async (credentials, { dispatch, rejectWithValue }) => {
//     try {
//       dispatch(setLoading(true))
//       const user = await authService.loginAndFetchUser(credentials)
//       dispatch(setUser(user))

//       //구독상태확인
//       const statusAction = await dispatch(checkSubStatThunk())
//       const status = statusAction.payload
//       if (status?.isActive) {
//         dispatch(fetchSubDetailsThunk())
//       }
//       return user
//     } catch (err) {
//       dispatch(setError(err.message))
//       // 여기서 백엔드 에러 응답이 있으면 그대로 넘김
//       if (err.response?.data) {
//         return rejectWithValue(err.response.data)
//       }

//       // ApiError 등 객체라면 그 자체를 넘기고, fallback 메시지 제공
//       if (err instanceof ApiError) {
//         return rejectWithValue({ code: err.code, message: err.message })
//       }
//       return rejectWithValue(err.message || '로그인중 알 수 없는 오류 발생' )
//     } finally {
//       dispatch(setLoading(false))
//     }
//   }
// )

export const signupThunk = createAsyncThunk(
  'auth/signup',
  async (userData, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      await authService.signupOnly(userData)
      return true
    } catch (err) {
        // ApiError 인지 확인
        if (err instanceof ApiError) {
            if (err.code === 'VALIDATION_FAILED') {
            // 유효성 에러: ValidationError[]
                const fieldErrors = {}
                err.errors.forEach(({ field, message }) => {
                    fieldErrors[field] = message
                })
                return rejectWithValue(fieldErrors)
            }
            if (err.code === 'VALIDATION_ERROR') {
                return rejectWithValue({ email: err.message }) // 이메일 중복 등
            }
            return rejectWithValue(err.message)
        }
        return rejectWithValue('알 수 없는 오류가 발생했습니다.')
    } finally {
        dispatch(setLoading(false))
    }
    //   dispatch(setError(err.message))
    //   return rejectWithValue(err.message)
    // } finally {
    //   dispatch(setLoading(false))
    // }
  }
)

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    await authService.logoutAndClear()
    dispatch(clearAuth())
  }
)

export const restoreUserThunk = createAsyncThunk(
    'auth/restoreUser',
    async (_, { dispatch, }) => {
        dispatch(setLoading(true))
        try {
            console.log('authService.tryResptoreUser()')
            const user = await authService.tryRestoreUser()
            if (user) {
                dispatch(setUser(user))
                const statusAction = await dispatch(checkSubStatThunk())
                const status = statusAction.payload
                console.log(statusAction.payload)
                if (status?.isActive) {
                  const detailsAction = await dispatch(fetchSubDetailsThunk())
                  console.log('fetchSubDetailsThunk 결과:', detailsAction)
                }    
            } else {
                dispatch(clearAuth())
                dispatch(resetSubscriptionState())
            }
        return user
        } finally {
        dispatch(setLoading(false))
        }
    }
)

export const oauth2CompleteThunk = createAsyncThunk(
  'auth/oauth2Complete',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      dispatch(setLoading(true))
      const user = await authService.oauth2CompleteAndFetchUser()
      dispatch(setUser(user))
      return user
    } catch (err) {
      if (err instanceof ApiError) {
        return rejectWithValue(err.message)
      }
      return rejectWithValue('OAuth2 인증 처리 실패')
    } finally {
      dispatch(setLoading(false))
    }
  }
)

// 계정 복구
export const reactivateThunk = createAsyncThunk(
  'auth/reactivate',
  async (credentials, {dispatch, rejectWithValue}) => {
    try {
      dispatch(setLoading(true))
      await authService.reactivate(credentials)
      const { user} = await authService.loginService(credentials)
      dispatch(setUser(user))
      return user
    } catch (err) {
      const msg = err?.message || err?.response?.data?.message || '계정 복구 실패'
      dispatch(setError(msg))
      return rejectWithValue({message: msg})
    } finally {
      dispatch(setLoading(false))
    }
  }
)