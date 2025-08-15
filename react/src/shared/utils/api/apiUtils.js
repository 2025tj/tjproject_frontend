import { ApiError } from '../../errors/ApiError'

/**
 * 공통 API 응답 처리 유틸 (code, timestamp 등 분석 포함)
 * @param {object} res - 서버 응답 객체 (ApiResponse<T>)
 * @returns {*} - 응답의 data 필드
 * @throws {ApiError} - 실패 응답 시 에러 객체
 */
export function unwrapApiResponse(res) {
  if (!res.success) {
    throw new ApiError({
      message: res.message || 'API 처리 실패',
      code: res.code || 'UNKNOWN_ERROR',
      timestamp: res.timestamp || new Date().toISOString(),
      path: res.path || '',
      errors: res.errors || [] // 없으면 빈 배열
    })
  }

  if (!res.data) {
    throw new ApiError({
      message: 'API 응답에 data가 없습니다.',
      code: 'NO_DATA',
      timestamp: res.timestamp || new Date().toISOString(),
      path: res.path || '',
      errors: []
    })
  }

  return res.data
}

export function unwrapApiResponseWithoutData(res) {
  if (!res.success) {
    throw new ApiError({
      message: res.message || 'API 처리 실패',
      code: res.code || 'UNKNOWN_ERROR',
      timestamp: res.timestamp || new Date().toISOString(),
      path: res.path || '',
      errors: res.errors || []
    })
  }

  return res.data ?? null
}