import {useSelector} from 'react-redux'

export const useSubscription = () => {
    const subState = useSelector(state => state.subscription)
    console.log('subscription state:', subState)

    return {
        ...subState,
        subDetails: subState.subscriptionDetails,
        hasActiveSub: subState.isActive,
        isSubLoading: subState.loading || subState.detailsLoading,
        subError: subState.error || subState.createError,
    }
}

export const usePremiumFeature = () => {
    const { hasActiveSub, isSubLoading } = useSubscription()

    const checkPremiumAccess = () => {
        if (isSubLoading) {
            return { allowed: false, reason: 'loading' }
        }

        if (!hasActiveSub) {
            return { allowed: false, reason: 'no_subscription' }
        }

        return { allowed: true, reason: null }
    }

    return {
        hasActiveSub,
        isSubLoading,
        checkPremiumAccess,
    }
}