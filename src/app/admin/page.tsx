"use client"
import DataTable from '@/components/table/DataTable'
import StatCard from '@/components/StatCard'
import { getRecentAppointmentList } from '@/lib/actions/appointment.action'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { columns } from '@/components/table/columns'
import { useRouter } from 'next/navigation'

const Admin = async () => {

    const encryptedKey = typeof window !== 'undefined' ? window.localStorage.getItem('accessKey') : null;
    const router = useRouter();
    if (!encryptedKey) {
        router.push('/')
    }
    const appointments = await getRecentAppointmentList();
    return (
        <div className='flex flex-col mx-auto max-w-7xl gap-y-14'>
            <header className='admin-header'>
                <Link href={'/'} className='cursor-pointer'>
                    <Image src='/assets/icons/logo-full.svg' height={32} width={162} alt='logo' className='h-8 w-fit' />
                </Link>
                <p className='text-16-semibold'>Admin Dashboard</p>
            </header>
            <main className='admin-main'>
                <section className='w-full space-y-4'>
                    <h1 className='header'>Welcome 👋</h1>
                    <p className='text-dark-700'>Start the day with managing new appointments</p>
                </section>
            </main>
            <section className='admin-stat px-2'>
                <StatCard type="appointments" count={appointments.scheduledCount} label="Scheduled appointments" icons="/assets/icons/appointments.svg" />
                <StatCard type="cancelled" count={appointments.cancelledCount} label="cancelled appointments" icons="/assets/icons/cancelled.svg" />
                <StatCard type="pending" count={appointments.pendingCount} label="pending appointments" icons="/assets/icons/pending.svg" />
            </section>
            <DataTable data={appointments.documents} columns={columns} />
        </div>
    )
}

export default Admin