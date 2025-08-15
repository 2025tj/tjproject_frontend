import {api} from '@shared/utils/api'

export const adminUserAPi = {
    fetchAllUsersApi: () => api.get('/admin/users'),
    blockUserApi: (id) => api.patch(`/admin/users/${id}/block`),
    activateUserApi: (id) => api.patch(`/admin/users/${id}/activate`),
    deactivateUserApi: (id) => api.patch(`/admin/users/${id}/deactivate`)
}