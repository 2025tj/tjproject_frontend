import { adminUserAPi as admin} from "../api/adminUserApi";

export const adminUserService = {
    getUsersService: async () => {
        const res = await admin.fetchAllUsersApi()
        return res.data
    },
    changeStatusService: async (id, action) => {
        let res
        switch (action) {
            case 'block':
                res= await admin.blockUserApi(id)
                break
            case 'activate':
                res = await admin.activateUserApi(id)
                break
            case 'deactivate':
                res = await admin.deactivateUserApi(id)
                break
        }
        return res.data
    }
}