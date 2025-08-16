import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { clearUserState } from "../store/userSlice"
import { withdrawThunk } from "../store/userThunk"

const KEY_ESC='Escape'

export default function WithdrawModal({open, onClose, requirePassword= true}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {withdrawing, withdrawError} = useSelector(state => state.user)

    const [password, setPassword] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const dialogRef = useRef(null)

    // ESC닫기
    useEffect(()=> {
        if(!open) return
        const onKey = (e) => {
            if(e.key === KEY_ESC && !withdrawing) onClose?.()
        }
        window.addEventListener('keydown', onKey)
        return() => window.removeEventListener('keydown', onKey)
    }, [open, onClose, withdrawing])

    // 열릴때 초기화
    useEffect(()=>{
        if(open) {
            setPassword('')
            setConfirmed(false)
            setPassword('')
            setTimeout(() => dialogRef.current.focus(),0)
        }
    }, [open, dispatch])

    const handleBackdrop = (e) => {
        if (e.target === e.currentTarget && !withdrawing) onClose?.()
    }

    const handleSubmit = async () => {
        const pw = requirePassword ? (password || null) : null
        const action = await dispatch(withdrawThunk(pw))
        if (withdrawThunk.fulfilled.match(action)) {
            alert(action.payload?.message || '탈퇴 처리되었습니다. 14일 후 영구 삭제됩니다.')
            onClose?.()
            navigate('/')
        }
    }

    if (!open) return null

    const disabled =withdrawing || !confirmed || (requirePassword && password.length === 0)

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4'
            onMouseDown={handleBackdrop}
            aria-modal='true'
            role='dialog'
            aria-labelledby='withdraw-title'
            aria-describedby='withdraw-desc'
        >
            <div
                ref={dialogRef}
                tabIndex={-1}
                className='w-full max-w-md rounded-2xl bg-white shadow-xl outline-none'
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className='p-6'>
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-10 h-10 bg-token-text-error rounded-full flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 id='withdraw-title' className='text-xl font-semibold text-token-text-primary'>
                            회원 탈퇴
                        </h2>
                    </div>
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-md mb-4">
                        <p id='withdraw-desc' className='text-sm text-amber-800'>
                            탈퇴 시 계정이 <b>비활성화</b>되며, <b>14일 후 영구 삭제</b>됩니다. 이 기간 내 재로그인시 탈퇴가 철회될 수 있습니다.
                        </p>
                    </div>

                    {requirePassword ? (
                        <div className='mt-4'>
                            <label className='block text-sm font-medium text-token-text-secondary mb-2'>비밀번호</label>
                            <input
                                type='password'
                                className='w-full px-3 py-2 border border-token-border-light rounded-md focus:outline-none focus:ring-2 focus:ring-token-interactive-accent-default focus:border-transparent transition-colors'
                                placeholder='계정 비밀번호를 입력하세요'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={withdrawing}
                            />
                        </div>
                    ) : (
                        <div className="p-3 bg-token-main-surface-secondary rounded-md mb-4">
                            <p className='text-sm text-token-text-secondary'>비밀번호 입력 없이 바로 탈퇴</p>
                        </div>
                    )}
                    <div className='mb-4 flex items-start space-x-3'>
                        <input
                            id='confirm'
                            type='checkbox'
                            className='mt-1 w-4 h-4 text-token-interactive-accent-default border-token-border-light rounded focus:ring-token-interactive-accent-default'
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            disabled={withdrawing}
                        />
                        <label htmlFor='confirm' className='text-sm text-token-text-secondary leading-relaxed'>
                            위 내용을 확인했고, 14일 유예 후 계정이 영구 삭제되는 것에 동의합니다.
                        </label>
                    </div>

                    {withdrawError && (
                        <div className='mb-4 p-3 bg-token-surface-error rounded-md'>
                            <p className='text-sm text-token-text-error'>{withdrawError}</p>
                        </div>
                    )}

                    <div className='flex justify-end space-x-3'>
                        <button
                            className='px-4 py-2 text-sm text-token-text-secondary bg-white border border-token-border-light rounded-md hover:bg-token-main-surface-secondary disabled:opacity-50 transition-colors'
                            onClick={onClose}
                            disabled={withdrawing}
                        >
                            취소
                        </button>
                        <button
                            className="px-4 py-2 text-sm text-white bg-token-text-error rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors font-medium"
                            onClick={handleSubmit}
                            disabled={disabled}
                        >
                            {withdrawing ? '처리중...' : '탈퇴하기'}
                        </button>
                </div>
            </div>
        </div>
    </div>
    )
}