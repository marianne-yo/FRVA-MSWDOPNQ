"use client"
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import LogoHeader from "./../../../components/LogoHeader"
import { Input } from '@/components/ui/input'
import { Form } from 'radix-ui'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// interface respondent {
//   fullName: string
//   positionFamily: Array<string>
//   numChildren: Int16Array
//   numFamHH: Int16Array
//   barangay: Array<string>
//   sitioPurok: string
//   beneficiary: boolean
//   beneficiaryDate: Int16Array
// }

// const defaultUser: respondent = { fullName: '', positionFamily: [], numChildren: 0, barangay: [], sitioPurok: '', beneficiary: false, beneficiaryDate: 0 }

export default function Page() {
  // const form = useForm({
  //   defaultValues: defaultUser,
  //   onSubmit: async ({ value }) => {
  //     //to-do
  //     console.log(value)
  //   }
  // })

  return (
    <main className="bg-[#FFFDF0] min-h-screen p-4 text-black">
      <div className="flex flex-col items-center mb-2">
        <LogoHeader />
        <h2 className="text-center font-bold">MSWDO Paniqui</h2>
        <h1 className="text-[2rem] font-bold text-center mt-5">FRVA Form</h1>
      </div>

      <div className="bg-white border border-[#3405F9] p-8 w-full max-w-4xl mx-auto rounded-xl">
        <h2 className="text-xl font-bold mb-6 border-b pb-2 text-black">I: Family Information</h2>

        <form action="">
          <label htmlFor="fullName" className='font-bold'>Full Name:</label>
          <Input type='text' id='fullName'/>

          <label htmlFor="barangay" className='font-bold'>Barangay:</label>
          <Input type='text' id='fullName'/>
          
          
        </form>

          <Button 
            variant={'default'}
            size={'lg'}
          >
            Next
          </Button>

          <RadioGroup defaultValue="comfortable" className="w-fit">
            <Field orientation="horizontal">
              <RadioGroupItem value="default" id="desc-r1" />
              <FieldContent>
                <FieldLabel htmlFor="desc-r1">Within the year</FieldLabel>
                <FieldDescription>
                  Ngayong taon
                </FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="comfortable" id="desc-r2" />
              <FieldContent>
                <FieldLabel htmlFor="desc-r2">2-5 Years Ago</FieldLabel>
                <FieldDescription>2-5 taon ang nakalipas</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="compact" id="desc-r3" />
              <FieldContent>
                <FieldLabel htmlFor="desc-r3">None</FieldLabel>
                <FieldDescription>
                  Wala
                </FieldDescription>
              </FieldContent>
            </Field>
          </RadioGroup>

        {/* <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-2"
        >
          <form.Field
            name='fullName'
            children={(field) => (
              <>
                <Input
                  value={field.state.value}
                  onBlur={field.handleBlur}
              </>
            )} */}
          {/* FULL NAME FIELD */}
          {/* <form.Field
            name="fullName"
            validators={{
              onChange: z.string().min(2, 'Name is too short / Masyadong maikli'),
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="font-bold text-black">Full Name / Pangalan</label>
                <input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border-2 border-gray-200 p-3 rounded-md text-black"
                />
                {field.state.meta.errors && (
                  <em className="text-red-500 text-sm not-italic">
                    {field.state.meta.errors.join(', ')}
                  </em>
                )}
              </div>
            )}
          </form.Field> */}

          {/* BARANGAY FIELD */}
          {/* <form.Field
            name="barangay"
            validators={{
              onChange: z.string().min(1, 'Please select a barangay'),
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-1">
                <label className="font-bold text-black">Barangay</label>
                <select
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className="border-2 border-gray-200 p-3 rounded-md bg-white text-black"
                >
                  <option value="">Select Barangay...</option>
                  {["Abogado", "Anonas", "Poblacion", "Samput"].map((brgy) => (
                    <option key={brgy} value={brgy}>{brgy}</option>
                  ))}
                </select>
                {field.state.meta.errors && (
                  <em className="text-red-500 text-sm not-italic">
                    {field.state.meta.errors.join(', ')}
                  </em>
                )}
              </div>
            )}
          </form.Field> */}

          {/* <button
            type="submit"
            className="w-full lg:w-1/3 bg-[#FF3539] text-white font-bold py-4 rounded-lg block mx-auto"
          >
            NEXT SECTION
          </button>
        </form> */}
      </div>
    </main>
  )
}