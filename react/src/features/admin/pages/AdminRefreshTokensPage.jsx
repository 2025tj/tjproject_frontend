import React, {useEffect, useMemo, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { setFilter, clearAdminRefreshTokenState, } from '../store/adminRefreshTokenSlice'
import { deleteRefreshTokenByEmailThunk, deleteRefreshTokenByPatternThunk, fetchRefreshTokenListThunk } from '../store/adminRefreshTokenThunk'

function fmtTTL(ms) {
    if (ms === -1) return 'no-expire'
    if (ms === -2) return 'not-found'
    if (ms <= 0) return '00:00'
    const total = Math.floor(ms / 1000)
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    const pad = (n) => String(n).padStart(2, '0')
    return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}
const AdminRefreshTokenPage = () => {
    const dispatch = useDispatch()
    const { list, loading, error, successMessage, filters } = useSelector(
        (state) => state.adminRefreshToken
    )
    
    // TTL 카운트 다운 표시용
    const fetchedAtRef = useRef(0)
    const [, forceTick] = useState(0)

    useEffect(() => {
        const id = setInterval(() => forceTick((n) => n + 1), 1000)
        return () => clearInterval(id)
    }, [])

    const ttlLeft = (ttl) => {
        if (ttl < 0) return ttl
        const elapsed = Date.now() - fetchedAtRef.current
        return Math.max(0, ttl - elapsed)
    }

    const rows = useMemo(
        () => list.map((r) => ({...r, _ttlLeft: ttlLeft(r.ttlMillis)})),
        [list, forceTick]
    )

    // 최초 로드
    useEffect(() => {
        (async () => {
            const action = await dispatch(fetchRefreshTokenListThunk(filters))
            if (fetchRefreshTokenListThunk.fulfilled.match(action)) {
                fetchedAtRef.current = Date.now()
            }
        })()
    }, [])

    // 성공/ 오류 메세지 3초 후 자동 클리어
    useEffect(() => {
        if (!successMessage && !error) return
        const t = setTimeout(() => dispatch(clearAdminRefreshTokenState()), 3000)
        return () => clearTimeout(t)
    }, [successMessage, error, dispatch])

    const reload = async () => {
        const action = await dispatch(fetchRefreshTokenListThunk(filters))
        if (fetchRefreshTokenListThunk.fulfilled.match(action)) {
            fetchedAtRef.current = Date.now()
        }
    }

    const onDeleteOne = async (email) => {
        if (!window.confirm(`Delete ${email}?`)) return
        await dispatch(deleteRefreshTokenByEmailThunk(email))
    }

    const onDeleteByPattern = async () => {
        if (!window.confirm(`Delete keys by pattern:\n${filters.pattern || 'rt:user:*'}`)) return
        await dispatch(deleteRefreshTokenByPatternThunk(filters.pattern || 'rt:user:*'))
    }

    return (
        <div style={{ apdding: 20}}>
            <h2>Refresh Token 관리</h2>
            {successMessage && (
                <div style={{ color: 'green', marginTop: 8}}>{successMessage}</div>
            )}
            {error && <div style={{ color: 'red', marginTop: 8}}>에러: {error}</div>}
            <div>
                <input
                    placeholder='pattern (예: rt:user:*)'
                    value = {filters.pattern}
                    onChange={(e) => dispatch(setFilter({pattern: e.target.value}))}
                    style={{padding: 8}}
                />
                <input
                    type='number'
                    min={1}
                    placeholder='limit'
                    value={filters.limit}
                    onChange={(e) => 
                        dispatch(setFilter({limit: parseInt(e.target.value || '100', 10)}))
                    }
                    style={{padding: 8}}
                />
                <button onClick={reload} disabled={loading} style={{padding: '8px 12px'}}>
                    {loading ? 'Loading...' : 'Reload'}
                </button>
                <button
                    onClick={onDeleteByPattern}
                    disabled={loading}
                    style={{padding: '8px 12px', background: '#ffe8e8'}}
                >Delete by Pattern</button>
            </div>
            <div style ={{overflowX: 'auto', border: '1px solid #ddd'}}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                    <thead style={{background: '#fafafa'}}>
                        <tr>
                            <th style={th}>Email</th>
                            <th style={th}>TTL</th>
                            <th style={th}>Hash Preview</th>
                            <th style={th}>Key</th>
                            <th style={th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length === 0 ? (
                            <tr>
                                <td style={td} colSpan={5}>{loading ? 'Loading...' : 'No data'}</td>
                            </tr>
                        ) : (
                            rows.map((r) => (
                                <tr key={r.key}>
                                    <td style={td}>{r.email}</td>
                                    <td style={td}>{fmtTTL(r._ttlLeft)}</td>
                                    <td style={td}>{r.hashPreview ?? '-'}</td>
                                    <td style={{...td, fontFamily: 'monospace'}}>{r.key}</td>
                                    <td style={td}>
                                        <button onClick={()=>onDeleteOne(r.email)} disabled={loading}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <p style={{maringTop: 8, color: '#666'}}>
                * TTL은 조회 시점을 기준으로 카운트다운 표시(-1: 만료 없음, -2: 키 없음).
            </p>
        </div>
    )
}
const th = {
    textAlign: 'left',
    padding: '10px 8px',
    borderBotton: '1px solid #eee',
    fontWeight: 600,
    fontSize: 14
}
const td = {
    padding: '8px',
    borderBottom: '1px solid #f2f2f2',
    fontSize: 14
}
export default AdminRefreshTokenPage
