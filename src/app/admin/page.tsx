
import React from 'react'
import { getRecentAppointmentList } from '@/lib/actions/appointment.action'
import AdminInfo from './Admin';

const Admin = async () => {

  
    const appointments = await getRecentAppointmentList();
    return (
        <div><AdminInfo appointments={appointments} /></div>

    )
}

export default Admin