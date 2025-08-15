import React, {useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAdminUsersThunk, changeUserStatusThunk } from '../store/adminUserThunk'

const AdminUserPage = () => {
    const dispatch = useDispatch()
    const {list, loading, error} = useSelector(state => state.adminUsers)
    // const currentUser = useSelector(state => state.user.profile)
    // console.log(currentUser)

    // // 관리자 권환 확인
    // if (!currentUser?.roles?.includes('ROLE_ADMIN')) {
    //     return <p>관리자만 접근할 수 있습니다.</p>
    // }

    useEffect(()=>{
        dispatch(fetchAdminUsersThunk())
    }, [dispatch])

    const handleAction = (id, action) => {
        dispatch(changeUserStatusThunk({id, action}))
    }

    return (
        <div style={{padding: 20}}>
            <h2>관리자 - 사용자 관리</h2>
            {loading && <p>로딩중...</p>}
            {error && <p style={{color: 'red'}}>{error}</p>}

            <table border="1" cellPadding='8' style={{width: '100%', marginTop: 20}}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Nickname</th>
                        <th>Roles</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {list.map(user=> (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.nickname}</td>
                            <td>{user.roles?.join(', ')}</td>
                            <td>{user.status}</td>
                            <td>
                                <button onClick={()=> handleAction(user.id, 'activate')}>활성화</button>
                                <button onClick={()=> handleAction(user.id, 'deactivate')}>비활성화</button>
                                <button onClick={()=>handleAction(user.id, 'block')}>차단</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
export default AdminUserPage