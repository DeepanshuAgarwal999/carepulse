"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormMessage } from "@/components/ui/form"
import CustomFormfields from "../CustomFormfields"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { userFormValidation } from "@/lib/Validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.action"

export enum FormFieldType {
    INPUT = 'input',
    TEXTAREA = 'textarea',
    PHONE_INPUT = 'phoneInput',
    CHECKBOX = 'checkbox',
    DATE_PICKER = 'datePicker',
    SELECT = 'select',
    SKELETON = 'skeleton'
}

const PatientForm = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof userFormValidation>>({
        resolver: zodResolver(userFormValidation),
        defaultValues: {
            name: "john",
            email: "",
            phone: ""
        },
    })
    async function onSubmit(values: z.infer<typeof userFormValidation>) {
        console.log(values);
        setIsLoading(true)
        try {
            const user = await createUser(values);
            if (user) router.push(`/patients/${user.$id}/register`)
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Hi there, .... 👋</h1>
                    <p className="text-dark-700">Get Started with Appointments.</p>
                </section>

                <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="name" label="Full name" placeholder="John Doe" iconSrc="/assets/icons/user.svg" iconAlt="name" />

                <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="email" label="Email Address" placeholder="JohnDoe@gmail.com" iconSrc="/assets/icons/email.svg" iconAlt="email" />

                <CustomFormfields control={form.control} fieldType={FormFieldType.PHONE_INPUT} name="phone" label="Phone number" iconSrc="/assets/icons/email.svg" />
                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form>
    )
}

export default PatientForm