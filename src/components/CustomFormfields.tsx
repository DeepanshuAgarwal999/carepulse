import React from 'react'
import {
    FormField,
    FormControl,
    FormDescription,
    FormItem,
    FormLabel,
    FormMessage,
} from './ui/form'
import { Input } from './ui/input'
import { Control } from 'react-hook-form'
import { FormFieldType } from './forms/PatientForm'
import Image from 'next/image'
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import { E164Number } from 'libphonenumber-js/core'
import { Checkbox } from './ui/checkbox'
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectTrigger, SelectValue } from './ui/select'

interface customProps {
    control: Control<any>
    fieldType: FormFieldType,
    name: string,
    placeholder?: string,
    label?: string,
    iconSrc?: string,
    iconAlt?: string
    disabled?: boolean,
    dateFormat?: string,
    showTimeSelect?: boolean,
    children?: React.ReactNode,
    renderSkeleton?: (field: any) => React.ReactNode
}

const RenderField = ({ field, props }: { field: any, props: customProps }) => {
    const { fieldType, name, iconAlt, iconSrc, placeholder, label, showTimeSelect, dateFormat, renderSkeleton, children } = props

    switch (fieldType) {
        case FormFieldType.INPUT:
            return (
                <div className='flex rounded border  border-dark-500 bg-dark-400'>
                    {
                        iconSrc && (
                            <Image src={iconSrc} alt={iconAlt || "icon"} height={24} width={24} className='ml-2' />
                        )
                    }
                    <FormControl>
                        <Input placeholder={placeholder} {...field} className='shad-input border-0' />
                    </FormControl>
                </div>
            )
        case FormFieldType.PHONE_INPUT:
            return (
                <PhoneInput
                    defaultCountry='IN'
                    placeholder={placeholder}
                    international
                    withCountryCallingCode
                    value={field.value as E164Number | undefined}
                    onChange={field.onChange}
                    className="input-phone"
                />

            )
        case FormFieldType.TEXTAREA:
            return (
                <FormControl>
                    <Textarea
                        placeholder={props.placeholder}
                        {...field}
                        className="shad-textArea"
                        disabled={props.disabled}
                    />
                </FormControl>
            );
        case FormFieldType.CHECKBOX:
            return (
                <FormControl>
                    <div className="flex items-center gap-4">
                        <Checkbox
                            id={name}
                            checked={field.value}
                            onCheckedChange={field.onChange}
                        />
                        <label htmlFor={name} className="checkbox-label">
                            {label}
                        </label>
                    </div>
                </FormControl>
            );
        case FormFieldType.DATE_PICKER:
            return (
                <div className="flex rounded-md border border-dark-500 bg-dark-400">
                    <Image
                        src="/assets/icons/calendar.svg"
                        height={24}
                        width={24}
                        alt="user"
                        className="ml-2"
                    />
                    <FormControl>
                        <ReactDatePicker
                            showTimeSelect={showTimeSelect ?? false}
                            selected={field.value}
                            onChange={(date: Date | null) => field.onChange(date)}
                            timeInputLabel="Time:"
                            dateFormat={dateFormat ?? "MM/dd/yyyy"}
                            wrapperClassName="date-picker"
                        />
                    </FormControl>
                </div>

            );
        case FormFieldType.SELECT:
            return (
                <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger className="shad-select-trigger">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="shad-select-content">
                            {children}
                        </SelectContent>
                    </Select>
                </FormControl>
            );
        case FormFieldType.SKELETON:
            return renderSkeleton ? renderSkeleton(field) : null;
        default:
            break;
    }
}

const CustomFormfields = (props: customProps) => {
    return (
        <FormField
            control={props.control}
            name={props.name}
            render={({ field }) => (
                <FormItem className='flex-1'>
                    {props.fieldType !== FormFieldType.CHECKBOX && props.label && (
                        <FormLabel>{props.label}</FormLabel>
                    )}
                    <RenderField field={field} props={props} />
                    <FormMessage className='shad-error' />
                </FormItem>
            )}
        />
    )
}

export default CustomFormfields