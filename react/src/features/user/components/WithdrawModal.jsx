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
                    <h2 id='withdraw-title' className='text-lg font-semibold'>
                        회원 탈퇴
                    </h2>
                    <p id='withdraw-desc' className='mt-2 text-sm text-gray-600'>
                        탈퇴 시 계정이 <b>비활성화</b>되며, <b>14일 후 영구 삭제</b>됩니다/ 이 기간 내 재로그인시 탈퇴가 철회될 수 있습니다. 
                    </p>

                    {requirePassword ? (
                        <div className='mt-4'>
                            <label className='block text-sm text-gray-700 mb-1'>비밀번호</label>
                            <input
                                type='password'
                                className='w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/70'
                                placeholder='계정 비밀번호를 입력하세요'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={withdrawing}
                            />
                        </div>
                    ) : (
                        <p className='mt-4 text-sm text-gray-600'>비밀번호 입력 없이 바로 탈퇴</p>
                    )}
                    
                    <div className='mt-4 flex items-start gap-2'>
                        <input
                            id='confirm'
                            type='checkbox'
                            className='mt-1'
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                            disabled={withdrawing}
                        />
                        <label htmlFor='confirm' className='text-sm text-gray-700'>
                            위 내용을 확인했고, 14일 유예 후 계정이 영구 삭제되는 것에 동의합니다.
                        </label>
                    </div>

                    {withdrawError && (
                        <div className='mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600'>
                            {withdrawError}
                        </div>
                    )}

                    <div className='mt-6 flex justify-end gap-3'>
                        <button
                            className='rounded-lg border px-4 py-2 text-sm hover:bg-gray-50 disabled:opacity-60'
                            onClick={onClose}
                            disabled={withdrawing}
                        >
                            취소
                        </button>
                        <button
                            className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-60"
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