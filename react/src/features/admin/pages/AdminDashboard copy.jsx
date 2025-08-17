import React from 'react'

import { Link} from 'react-router-dom'

const AdminDashboard = () => {

    
    return (
        <div style={{ padding: 20}}>
            <h2>관리자 대시보드</h2>
            <ul>
                <li><Link to="/admin/users">회원 관리</Link></li>
                <li><Link to="/admin/refunds">환불 관리</Link></li>
                <li><Link to='/admin/refresh-tokens'>Refresh Token 관리</Link></li>
            </ul>
        </div>
    )
}
export default AdminDashboard