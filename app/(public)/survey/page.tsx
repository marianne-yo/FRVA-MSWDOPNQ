"use client"
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import LogoHeader from "./../../../components/LogoHeader"

export default function Page() {
  // 1. Initialize the form with the adapter at the TOP level
  const form = useForm({
    defaultValues: {
      fullName: '',
      barangay: '',
    },
    // This is where the adapter goes in current versions
    validatorAdapter: zodValidator(), 
    onSubmit: async ({ value }) => {
      console.log('Submitted values:', value)
    },
  })

  return (
    <main className="bg-[#FFFDF0] min-h-screen p-5 text-black">
      <div className="flex flex-col items-center mb-10">
        <LogoHeader />
        <h2 className="text-center font-bold">MSWDO Paniqui</h2>
        <h1 className="text-[2rem] font-bold text-center mt-5">FRVA Form</h1>
      </div>

      <div className="bg-white border-2 border-[#3405F9] p-8 w-full max-w-4xl mx-auto rounded-xl">
        <h2 className="text-xl font-bold mb-6 border-b pb-2 text-black">I: Family Information</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          {/* FULL NAME FIELD */}
          <form.Field
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
          </form.Field>

          {/* BARANGAY FIELD */}
          <form.Field
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
          </form.Field>

          <button
            type="submit"
            className="w-full lg:w-1/3 bg-[#FF3539] text-white font-bold py-4 rounded-lg block mx-auto"
          >
            NEXT SECTION
          </button>
        </form>
      </div>
    </main>
  )
}