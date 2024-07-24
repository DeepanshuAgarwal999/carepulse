import RegisterForm from '@/components/forms/RegisterForm'
import { getUser } from '@/lib/actions/patient.action'
import { currentYear } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import * as Sentry from '@sentry/nextjs'

const Register = async ({ params: { userId } }: SearchParamProps) => {
    const user = await getUser(userId);

    Sentry.metrics.set("user_view_register", user.name);

    return (
        <div className='flex h-screen max-h-screen'>
            <section className='remove-scrollbar container '>
                <div className='sub-container max-w-[860px] '>

                    <Image src={'/assets/icons/logo-full.svg'} height={1000} width={1000} alt='patient' className='mb-12 h-10 w-fit' />
                    <RegisterForm user={user} />
                    <div className='text-14-regular mt-20 flex justify-between'>
                        <p className='copyright'>
                            &copy; {currentYear} CarePulse
                        </p>
                        <Link href={'/?admin=true'} className='text-green-500'>
                            Admin
                        </Link>
                    </div>
                </div>
            </section>
            <Image src={'/assets/images/register-img.png'} alt='patient' height={1000} width={1000} className='side-img max-w-[390px]' />

        </div>
    )
}

export default Register