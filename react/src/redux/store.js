import { configureStore } from '@reduxjs/toolkit'
import company from './reducerSlices/companySlice'
import association from './reducerSlices/associationSlice'
import news from './reducerSlices/newsSlice'
import companySearch from './reducerSlices/companySearchSlice'
import auth from '@features/auth/store/authSlice'
import user from '@features/user/store/userSlice'
import subscription from '@features/subscription/store/subscriptionSlice'
import reviewAnalysis from './reducerSlices/reviewAnalysisSlice'

const store = configureStore({
    reducer: {
        company,
        association,
        companySearch,
        news,
        auth,
        user,
        subscription,
        reviewAnalysis,
        // info
    }
});

export default store
