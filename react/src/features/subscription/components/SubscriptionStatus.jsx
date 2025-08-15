import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { useSubscription } from '@features/subscription/hooks/useSubscription'
import { checkSubStatThunk} from '@features/subscription/store/subscriptionThunk'

const SubscriptionStatus = () => {
    const dispatch = useDispatch()
    const { hasActiveSub, subDetails, isSubLoading } = useSubscription()

    useEffect(()=> {
        console.log('hasActiveSub: ', hasActiveSub)
        console.log('subDetails: ', subDetails)
        console.log('isSubLoading: ', isSubLoading)
    },[hasActiveSub])

    useEffect(() => {
        dispatch(checkSubStatThunk())
    }, [dispatch])

    if (isSubLoading) {
        return (
            <div>
                로딩...
            </div>
        )
    }

    if (!hasActiveSub || !subDetails) {
        return (
            <Link to='/subscription'>
                구독하기
            </Link>
        )
    }

    return (
        <Link to='/subscription/manage'>
            <svg fill="currentColor" viewBox='0 0 20 20'>
                <path fillRule='evenodd' d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            {subDetails?.plan?.name === 'trial' && '체험'}
            {subDetails?.plan?.name === 'monthly' && '월간'}
            {subDetails?.plan?.name === 'yearly' && '연간'}
        </Link>
    )
    
}

export default SubscriptionStatus