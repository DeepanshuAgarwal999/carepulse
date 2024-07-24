import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'

type Props = {
    className?: string
    isLoading: boolean,
    children: React.ReactNode,
}

function SubmitButton({ children, isLoading, className }: Props) {
    return (
        <Button type='submit' disabled={isLoading} className={className ?? 'shad-primary-btn w-full hover:opacity-95 active:scale-95 ease-in-out  duration-200'} >{
            isLoading ? <div className='flex gap-4 items-center'><Image src={'/assets/icons/loader.svg'} alt='loader' width={24} height={24} className='animate-spin' />Loading...</div> : children
        }</Button >
    )
}

export default SubmitButton