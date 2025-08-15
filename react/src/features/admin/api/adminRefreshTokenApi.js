import {api} from '@shared/utils/api'

export const adminRefreshTokenApi = {
    // GET /api/admin/refresh-tokens?pattern=...&limit=...&scanCount=...
    listApi: ({ pattern = 'rt:user:*', limit = 100, scanCount = 1000} = {}) =>
        api.get('/admin/refresh-tokens', { params: { pattern, limit, scanCount }}),

    // DELETE /api/admin/refresh-tokens/{email}
    deleteOne: (email) =>
        api.delete(`/admin/refresh-tokens/${endcodeURIComponent(email)}`),

    // DELETE /api/admin/refresh-tokens?pattern=...
    deleteByPattern: (pattern = 'rt:user:*') =>
        api.delete('/admin/refresh-tokens', { params: {pattern}}),
}