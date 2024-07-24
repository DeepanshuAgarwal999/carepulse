"use client"
import React, { Dispatch, SetStateAction, useState } from 'react'
import CustomFormfields from '../CustomFormfields'
import { FormFieldType } from './PatientForm'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getAppointmentSchema } from '@/lib/Validation'
import { z } from 'zod'
import { Form } from '../ui/form'
import Image from 'next/image'
import { SelectItem } from '../ui/select'
import { Doctors } from '../../../constants'
import SubmitButton from '../SubmitButton'
import { Appointment } from '../../../types/appwrite'
import { createAppointment, updateAppointment } from '@/lib/actions/appointment.action'

const AppointmentForm = ({ userId, patientId, type, appointment,
    setOpen, }: {
        userId: string, patientId: string, type: 'create' | "cancel" | "schedule", appointment?: Appointment;
        setOpen?: Dispatch<SetStateAction<boolean>>;
    }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const AppointmentFormValidation = getAppointmentSchema(type);

    const form = useForm<z.infer<typeof AppointmentFormValidation>>({
        resolver: zodResolver(AppointmentFormValidation),
        defaultValues: {
            primaryPhysician: appointment ? appointment?.primaryPhysician : "",
            schedule: appointment
                ? new Date(appointment?.schedule!)
                : new Date(Date.now()),
            reason: appointment ? appointment.reason : "",
            note: appointment?.note || "",
            cancellationReason: appointment?.cancellationReason || "",
        },
    });

    const createSchema = getAppointmentSchema("create")
    async function onSubmit(values: z.infer<typeof createSchema>) {
        let status;
        switch (type) {
            case "schedule":
                status = "scheduled";
                break;
            case "cancel":
                status = "cancelled";
                break;
            default:
                status = "pending";
        }
        setIsLoading(true)
        try {
            if (type === 'create' && patientId) {
                const appointmentData = {
                    userId,
                    patient: patientId,
                    primaryPhysician: values.primaryPhysician,
                    schedule: new Date(values.schedule),
                    reason: values.reason!,
                    status: status as Status,
                    note: values.note,
                };
                const appointment = await createAppointment(appointmentData)
                if (appointment) {
                    router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`)
                }
            }
            else {
                console.log(type)
                const appointmentToUpdate = {
                    userId,
                    appointmentId: appointment?.$id!,
                    appointment: {
                        primaryPhysician: values.primaryPhysician,
                        schedule: new Date(values.schedule),
                        status: status as Status,
                        cancellationReason: values.cancellationReason,
                    },
                    type
                }
                console.log(appointmentToUpdate);
                const updatedAppointment = await updateAppointment(appointmentToUpdate)
                console.log(updatedAppointment);
                if (updatedAppointment) {
                    setOpen && setOpen(false)
                    form.reset()
                }

            }
        } catch (error) {

        }
        finally {
            setIsLoading(false)
        }

    }
    let buttonLabel;
    switch (type) {
        case 'cancel':
            buttonLabel = 'Cancel Appointment'
            break;
        case 'create':
            buttonLabel = "Book Appointment"
            break;
        case 'schedule':
            buttonLabel = "Schedule Appointment"
            break;
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {type === "create" && (
                    <section className="mb-12 space-y-4">
                        <h1 className="header">New Appointment</h1>
                        <p className="text-dark-700">
                            Request a new appointment in 10 seconds.
                        </p>
                    </section>
                )}
                {/* <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="name" label="Full name" placeholder="John Doe" iconSrc="/assets/icons/user.svg" iconAlt="name" /> */}
                {
                    type !== 'cancel' && <>
                        <CustomFormfields control={form.control} fieldType={FormFieldType.SELECT} name="primaryPhysician" label="Doctor" placeholder="Select a doctor" >
                            {Doctors.map((doctor) => (
                                <SelectItem key={doctor.name} value={doctor.name}>
                                    <div className="flex items-center gap-2 cursor-pointer">
                                        <Image src={doctor.image} alt={doctor.name} width={32} height={32} className="border border-dark-500 rounded-full" />
                                        <p>{doctor.name}</p>
                                    </div>
                                </SelectItem>
                            ))}
                        </CustomFormfields>
                        <CustomFormfields
                            fieldType={FormFieldType.DATE_PICKER}
                            name='schedule'
                            control={form.control}
                            label='Expected appointment date'
                            showTimeSelect
                            dateFormat='MM/dd/yyyy - h:mm aa'
                        />
                        <div className="flex flex-col gap-6 xl:flex-row">
                            <CustomFormfields control={form.control} fieldType={FormFieldType.TEXTAREA} name="reason" label="Reason for appointment" placeholder="Enter reason for appointmen" />
                            <CustomFormfields control={form.control} fieldType={FormFieldType.TEXTAREA} name="note" label="Notes" placeholder="Enter notes" />
                        </div>


                    </>
                }

                {
                    type === "cancel" && (
                        <>
                            <CustomFormfields control={form.control} fieldType={FormFieldType.TEXTAREA} name="cancellationReason" label="Reason for cancellation" placeholder="Enter reason for cancellation" />
                        </>
                    )
                }
                <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn '} w-full`}>
                    {buttonLabel}
                </SubmitButton>
            </form>
        </Form>
    )
}

export default AppointmentForm