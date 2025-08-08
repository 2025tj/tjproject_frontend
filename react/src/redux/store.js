import { configureStore } from '@reduxjs/toolkit'
import company from './reducerSlices/companySlice'
import association from './reducerSlices/associationSlice'
import news from './reducerSlices/newsSlice'
import companySearch from './reducerSlices/companySearchSlice'
import auth from '@features/auth/store/authSlice'
import user from '@features/user/store/userSlice'
import subscription from '@features/subscription/store/subscriptionSlice'
import adminUsers from '@features/admin/store/adminUserSlice'
import adminRefunds from '@features/admin/store/adminRefundSlice'
import adminRefreshToken from '@features/admin/store/adminRefreshTokenSlice'

const store = configureStore({
    reducer: {
        company,
        association,
        companySearch,
        news,
        auth,
        user,
        subscription,
        adminUsers,
        adminRefunds,
        adminRefreshToken,
        // info
    },
    devTools: true,
});

export default store
