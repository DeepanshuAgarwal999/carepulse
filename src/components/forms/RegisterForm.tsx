"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormMessage } from "@/components/ui/form"
import CustomFormfields from "../CustomFormfields"
import React, { useState } from 'react'
import { FormFieldType } from "./PatientForm"
import SubmitButton from "../SubmitButton"
import { PatientFormValidation } from "@/lib/Validation"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "../../../constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.action"

const RegisterForm = ({ user }: { user: User }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof PatientFormValidation>>({
        resolver: zodResolver(PatientFormValidation),
        defaultValues: {
            ...PatientFormDefaultValues,
            name: user.name,
            email: user.email,
            phone: user.phone,
        }
    })
    async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
        console.log(values);
        let formData;
        if (values.identificationDocument && values.identificationDocument.length > 0) {
            const blobFile = new Blob([values.identificationDocument[0]], {
                type: values.identificationDocument[0].type
            })
            formData = new FormData();
            formData.append('blobFile', blobFile)
            formData.append('fileName', values.identificationDocument[0].name)
        }
        setIsLoading(true)
        try {
            const patientData = {
                userId: user.$id,
                name: values.name,
                email: values.email,
                phone: values.phone,
                birthDate: new Date(values.birthDate),
                gender: values.gender,
                address: values.address,
                occupation: values.occupation,
                emergencyContactName: values.emergencyContactName,
                emergencyContactNumber: values.emergencyContactNumber,
                primaryPhysician: values.primaryPhysician,
                insuranceProvider: values.insuranceProvider,
                insurancePolicyNumber: values.insurancePolicyNumber,
                allergies: values.allergies,
                currentMedication: values.currentMedication,
                familyMedicalHistory: values.familyMedicalHistory,
                pastMedicalHistory: values.pastMedicalHistory,
                identificationType: values.identificationType,
                identificationNumber: values.identificationNumber,
                identificationDocument: values.identificationDocument
                    ? formData
                    : undefined,
                privacyConsent: values.privacyConsent,
            }
            const newPatient = await registerPatient(patientData);
            console.log("hiiii");

            if (newPatient) {
                console.log("hiiii");
                router.push(`/patients/${user.$id}/new-appointment`);
            }
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsLoading(false)
        }
    }
    // console.log(user);
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <section className="mb-12 space-y-4">
                    <h1 className="header">Welcome 👋</h1>
                    <p className="text-dark-700">Let us know more about yourself.</p>
                </section>
                <section className="mb-12 space-y-6">
                    <div className="mb-9 space-y-1">
                        <h1 className="sub-header">Personal Information</h1>
                    </div>
                </section>
                <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="name" label="Full name" placeholder="John Doe" iconSrc="/assets/icons/user.svg" iconAlt="name" />
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="email" label="Email Address" placeholder="JohnDoe@gmail.com" iconSrc="/assets/icons/email.svg" iconAlt="email" />
                    <CustomFormfields control={form.control} fieldType={FormFieldType.PHONE_INPUT} name="phone" label="Phone number" iconSrc="/assets/icons/email.svg" />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormfields control={form.control} fieldType={FormFieldType.DATE_PICKER} name="birthDate" label="Date of Birth" iconAlt="date" />
                    <CustomFormfields
                        fieldType={FormFieldType.SKELETON}
                        control={form.control}
                        name="gender"
                        label="Gender"
                        renderSkeleton={(field) => (
                            <FormControl>
                                <RadioGroup
                                    className="flex h-11 gap-6 xl:justify-between"
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    {GenderOptions.map((option, i) => (
                                        <div key={option + i} className="radio-group">
                                            <RadioGroupItem value={option} id={option} />
                                            <Label htmlFor={option} className="cursor-pointer">
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                        )}
                    />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="address" label="Address" placeholder="New york" />
                    <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="occupation" label="Occupation" placeholder="Software Engineer" />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="emergencyContactName" label="Emergency contact name" placeholder="Guardian's name" />
                    <CustomFormfields control={form.control} fieldType={FormFieldType.PHONE_INPUT} name="emergencyContactNumber" label="Emergency contact number" placeholder="Software Engineer" />
                </div>

                <section className="mb-12 space-y-6">
                    <div className="mb-9 space-y-1">
                        <h1 className="sub-header">Medical Information</h1>
                    </div>
                </section>
                <CustomFormfields control={form.control} fieldType={FormFieldType.SELECT} name="primaryPhysician" label="Primary Physician" placeholder="Select a physician" >
                    {Doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                            <div className="flex items-center gap-2 cursor-pointer">
                                <Image src={doctor.image} alt={doctor.name} width={32} height={32} className="border border-dark-500 rounded-full" />
                                <p>{doctor.name}</p>
                            </div>
                        </SelectItem>
                    ))}
                </CustomFormfields>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="insuranceProvider" label="Insurance provider" placeholder="BlueCross BlueShield" />
                    <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="insurancePolicyNumber" label="Insurance number" placeholder="ABD233213213" />
                </div>
                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormfields control={form.control} fieldType={FormFieldType.TEXTAREA} name="allergies" label="Allergies (if any)" placeholder="ex: Peanuts, Penicillin, Pollen" />
                    <CustomFormfields control={form.control} fieldType={FormFieldType.TEXTAREA} name="currentMedication" label="Current medications" placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg" />
                </div>

                <div className="flex flex-col gap-6 xl:flex-row">
                    <CustomFormfields control={form.control} fieldType={FormFieldType.TEXTAREA} name="familyMedicalHistory" label="Family medical history" placeholder="ex: diabetes" />
                    <CustomFormfields control={form.control} fieldType={FormFieldType.TEXTAREA} name="pastMedicalHistory" label="Past medical history" placeholder="ex: Asthma diagnosis in childhood" />
                </div>
                <section className="mb-12 space-y-6">
                    <div className="mb-9 space-y-1">
                        <h1 className="sub-header">Identification and Verfication</h1>
                    </div>
                </section>

                <CustomFormfields control={form.control} fieldType={FormFieldType.SELECT} name="identificationType" label="Identification type" placeholder="Birth Certificate" >
                    {IdentificationTypes.map((identity, i) => (
                        <SelectItem key={identity + 1} value={identity}>
                            <p>{identity}</p>
                        </SelectItem>
                    ))}
                </CustomFormfields>
                <CustomFormfields control={form.control} fieldType={FormFieldType.INPUT} name="identificationNumber" label="Identification number" placeholder="ex 1234567" />
                <CustomFormfields
                    fieldType={FormFieldType.SKELETON}
                    control={form.control}
                    name="identificationDocument"
                    label="Scanned Copy of Identification Document"
                    renderSkeleton={(field) => (
                        <FormControl>
                            <FileUploader files={field.value} onChange={field.onChange} />
                        </FormControl>
                    )}
                />
                <section className="space-y-6">
                    <div className="mb-9 space-y-1">
                        <h2 className="sub-header">Consent and Privacy</h2>
                    </div>

                    <CustomFormfields
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="treatmentConsent"
                        label="I consent to receive treatment for my health condition."
                    />

                    <CustomFormfields
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="disclosureConsent"
                        label="I consent to the use and disclosure of my health
            information for treatment purposes."
                    />

                    <CustomFormfields
                        fieldType={FormFieldType.CHECKBOX}
                        control={form.control}
                        name="privacyConsent"
                        label="I acknowledge that I have reviewed and agree to the
            privacy policy"
                    />
                </section>

                <SubmitButton isLoading={isLoading}>
                    Get Started
                </SubmitButton>
            </form>
        </Form >
    )
}

export default RegisterForm