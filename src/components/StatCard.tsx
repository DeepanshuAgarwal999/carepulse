"use client"
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

type statCardProps = {
    type: "appointments" | "cancelled" | "pending",
    count: number,
    label: string,
    icons: string
}

const StatCard = ({ type, count, icons, label }: statCardProps) => {
    return (
        <figure className={cn("stat-card", {
            'bg-pending': type === 'pending',
            'bg-appointments': type === 'appointments',
            'bg-cancelled': type === 'cancelled',
        })}>
            <div className='flex items-center gap-4'>
                <Image src={icons} height={32} width={32} alt={label} className='size-8 w-fit' />
                <h2 className='text-32-bold text-white'>{count}</h2>
            </div>
            <p className='text-14-regular '>
                {label}
            </p>
        </figure>
    )
}

export default StatCard