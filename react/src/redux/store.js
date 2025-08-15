import { configureStore } from '@reduxjs/toolkit'
import company from './reducerSlices/companySlice'
import keyword from './reducerSlices/keywordSlice'
import companySearch from './reducerSlices/companySearchSlice'
import auth from '@features/auth/store/authSlice'
import user from '@features/user/store/userSlice'
import subscription from '@features/subscription/store/subscriptionSlice'
import reviewAnalysis from './reducerSlices/reviewAnalysisSlice'
import reputation from './reducerSlices/reputationSlice'
import adminUsers from '@features/admin/store/adminUserSlice'
import adminRefunds from '@features/admin/store/adminRefundSlice'
import adminRefreshToken from '@features/admin/store/adminRefreshTokenSlice'
import chatbot from './reducerSlices/chatbotSlice'
import association from './reducerSlices/associationSlice'


const store = configureStore({
    reducer: {
        company,
        keyword,
        companySearch,
        auth,
        user,
        subscription,
        reviewAnalysis,
        reputation,
        adminUsers,
        adminRefunds,
        adminRefreshToken,
        chatbot,
        association,
        // info
    },
    devTools: true,
});

export default store
