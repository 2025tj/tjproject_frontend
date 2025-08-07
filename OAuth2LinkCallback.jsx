import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import api from '../utils/axios'

const OAuth2LinkCallback = () => {
    const navigate = useNavigate()
    const { search } = useLocation()
    const [status, setStatus] = useState<'idle'|'success'|'error'>('idle')
    const [error, setError]   = useState('')

    useEffect(() => {
    const params = new URLSearchParams(search)
    if (params.get('link') !== 'true') {
        return navigate(-1)  // 잘못 들어왔으면 뒤로
    }

    (async () => {
        try {
            // 1) pending 정보 안 써도 됩니다. 이미 인증된 세션으로 OAuth2AuthorizedClientService 가 처리
            const provider = params.get('provider')  // 필요하다면 하나 더 받아두세요
            const providerId = params.get('providerId')  // 마찬가지

            // 2) 바로 연동 API 호출
            await api.post('/api/social/link-oauth2', {
            provider,
            providerId
            }, { withCredentials: true })

            setStatus('success')
        } catch (e) {
            console.error(e)
            setError('소셜 연동에 실패했습니다.')
            setStatus('error')
        }
        })()
    }, [search, navigate])

    // 모달 띄우고 뒤로 돌아가기
    if (status === 'success') {
        return (
        <Modal
            title="연동 완료"
            onClose={() => navigate(-1)}
        >
            소셜 계정이 성공적으로 연동되었습니다!
        </Modal>
        )
    }

    if (status === 'error') {
        return (
        <Modal
            title="연동 실패"
            onClose={() => navigate(-1)}
        >
            {error}
        </Modal>
        )
    }

    return <div>연동 처리 중…</div>
}

export default OAuth2LinkCallback
