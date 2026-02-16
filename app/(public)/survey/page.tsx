"use client"
import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { zodValidator } from '@tanstack/zod-form-adapter'
import { z } from 'zod'
import LogoHeader from "./../../../components/LogoHeader"
import { Input } from '@/components/ui/input'
import { Form } from 'radix-ui'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function Page() {
  const [step, setStep] = useState(1);

  const categories = [
    { id: 2, label: "Individual Life Cycle Risks", range: [1, 30] },
    { id: 3, label: "Economic Risks", range: [31, 44] },
    { id: 4, label: "Environment and Disaster Risks", range: [45, 50] },
    { id: 5, label: "Social and Governance Risks", range: [51, 74] }
  ];

  const form = useForm({
    defaultValues: {
      fullName: '',
      positionFamily: '',
      positionFamilyOther: '',
      numChildren: 0,
      numFamHH: 1,
      is4ps: 'no',
      beneficiaryYear: '',
      barangay: '',
      sitioPurok: '',
      // We will initialize 74 responses here
      responses: Array.from({ length: 74 }, (_, i) => ({
        q_id: i + 1,
        choice: ''
      }))
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      console.log('Final Data:', value)
      // Here is where you will send data to Supabase
    },
  })

  return (
    <main className="bg-[#FFFDF0] min-h-screen p-2 text-black">
      <div className="flex flex-col items-center mb-2">
        <LogoHeader />
        <h2 className="text-center font-bold">MSWDO Paniqui</h2>
        <h1 className="text-[2rem] font-bold text-center ">FAMILY SURVEY ON RISKS AND VULNERABILITY</h1>
      </div>
    
    <div className="bg-white border border-[#3405F9] p-8 w-full max-w-4xl mx-auto rounded-md shadow-sm">
        <form onSubmit={(e) => { e.preventDefault(); e.stopPropagation(); }}>
        {/* STEP 1: FAMILY INFORMATION */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-3 border-b pb-2">I: Family Information</h2>
              
              <form.Field name="fullName">
                {(field) => (
                  <div>
                    <label className="font-bold text-1xl mb-0">Full Name:</label>
                    <br />
                    <label className="font-light text-xs italic">Buong Pangalan</label>
                    <Input 
                      value={field.state.value} 
                      onChange={(e) => field.handleChange(e.target.value)} 
                      placeholder='e.g. Juan Dela Cruz'
                    />
                  </div>
                )}
              </form.Field>
              
              <form.Field name="positionFamily">
                {(field) => (
                  <div className="space-y-2">
                    <label className="font-bold text-black">Position in the family / Posisyon sa Pamilya:</label>
                    <Select 
                      onValueChange={field.handleChange} 
                      value={field.state.value}
                    >
                      <SelectTrigger className="w-full text-black">
                        <SelectValue placeholder="Select position..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Father">Father (Ama / Tatay)</SelectItem>
                        <SelectItem value="Mother">Mother (Ina / Nanay)</SelectItem>
                        <SelectItem value="Son">Son (Anak na Lalaki)</SelectItem>
                        <SelectItem value="Daughter">Daughter (Anak na Babae)</SelectItem>
                        <SelectItem value="Grandparent">Grandparent (Lolo / Lola)</SelectItem>
                        <SelectItem value="Other">Other (Iba pa)</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Conditional Input for "Other" */}
                    <form.Subscribe selector={(state) => state.values.positionFamily}>
                      {(position) => position === 'Other' && (
                        <form.Field name="positionFamilyOther">
                          {(otherField) => (
                            <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-300">
                              <label className="text-sm font-semibold text-gray-700 italic">
                                Please specify / Pakisulat kung ano:
                              </label>
                              <Input 
                                className="mt-1 border-[#3405F9]"
                                placeholder="e.g. Uncle, Foster Parent, etc."
                                value={otherField.state.value}
                                onChange={(e) => otherField.handleChange(e.target.value)}
                              />
                            </div>
                          )}
                        </form.Field>
                      )}
                    </form.Subscribe>
                  </div>
                )}
              </form.Field>
              
              <div className='grid grid-cols-2'>
              <form.Field name="numChildren">
                  {(field) => (
                    <div>
                      <label className="font-bold">Number of Children:</label>
                      <Select 
                        onValueChange={(val) => field.handleChange(Number(val))} 
                        value={field.state.value.toString()}
                      >
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue placeholder="----" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                          <SelectItem value="12">12+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="numFamHH">
                  {(field) => (
                    <div>
                      <label className="font-bold">Number of Family Members in the Household:</label>
                      <Select 
                        onValueChange={(val) => field.handleChange(Number(val))} 
                        value={field.state.value.toString()}
                      >
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue placeholder="----" />
                        </SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(num => (
                            <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                          ))}
                          <SelectItem value="12">12+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>
              </div>


              <div className="grid grid-cols-2 gap-4">
                 <form.Field name="is4ps">
                  {(field) => (
                    <div>
                      <label className="font-bold">Are you a 4ps beneficiary?</label>
                      <Select onValueChange={field.handleChange} defaultValue={field.state.value}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">YES</SelectItem>
                          <SelectItem value="no">NO</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>

                <form.Field name="beneficiaryYear">
                  {(field) => (
                    <form.Subscribe selector={(state) => state.values.is4ps}>
                      {(is4ps) => (
                        <div>
                          <label className="font-bold">Since when?</label>
                          <Input 
                            type="number" 
                            disabled={is4ps === 'no'}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                          />
                        </div>
                      )}
                    </form.Subscribe>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <form.Field name="barangay">
                  {(field) => (
                    <div>
                      <label className="font-bold">Barangay</label>
                      <Select onValueChange={field.handleChange} defaultValue={field.state.value}>
                        <SelectTrigger className="w-full max-w-48">
                          <SelectValue placeholder="Select a barangay" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Barangay</SelectLabel>
                            <SelectItem value="abogado">Abogado</SelectItem>
                            <SelectItem value="acocolao">Acocolao</SelectItem>
                            <SelectItem value="aduas">Aduas</SelectItem>
                            <SelectItem value="apulid">Apulid</SelectItem>
                            <SelectItem value="Balaoang">Balaoang</SelectItem>
                            <SelectItem value="barang">Barang</SelectItem>
                            <SelectItem value="brillante">Brillante</SelectItem>
                            <SelectItem value="burgos">Burgos</SelectItem>
                            <SelectItem value="cabayaoasan">Cabayaoasan</SelectItem>
                            <SelectItem value="canan">Canan</SelectItem>
                            <SelectItem value="cariño">Cariño</SelectItem>
                            <SelectItem value="cayanga">Cayanga</SelectItem>
                            <SelectItem value="colibangbang">Colibangbang</SelectItem>
                            <SelectItem value="coral">Coral</SelectItem>
                            <SelectItem value="dapdap">Dapdap</SelectItem>
                            <SelectItem value="estacion">Estacion</SelectItem>
                            <SelectItem value="mabilang">Mabilang</SelectItem>
                            <SelectItem value="manaois">Manaois</SelectItem>
                            <SelectItem value="matalapitap">Matalapitap</SelectItem>
                            <SelectItem value="nagmisaan">Nagmisaan</SelectItem>
                            <SelectItem value="nancamarinan">Nancamarinan</SelectItem>
                            <SelectItem value="nipaco">Nipaco</SelectItem>
                            <SelectItem value="patalan">Patalan</SelectItem>
                            <SelectItem value="poblacion-norte">Poblacion Norte</SelectItem>
                            <SelectItem value="poblacion-sur">Poblacion Sur</SelectItem>
                            <SelectItem value="rang-ayan">Rang-ayan</SelectItem>
                            <SelectItem value="salomague">Salomague</SelectItem>
                            <SelectItem value="samput">Samput</SelectItem>
                            <SelectItem value="san-carlos">San Carlos</SelectItem>
                            <SelectItem value="san-isidro">San Isidro</SelectItem>
                            <SelectItem value="san-juan-de-milla">San Juan de Milla</SelectItem>
                            <SelectItem value="santa-ines">Santa Ines</SelectItem>
                            <SelectItem value="sinigpit">Sinigpit</SelectItem>
                            <SelectItem value="tablang">Tablang</SelectItem>
                            <SelectItem value="ventinilla">Ventinilla</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </form.Field>

                {/* Sitio/Purok - Simplified */}
                <form.Field name="sitioPurok">
                  {(field) => (
                    <div>
                      <label className="font-bold">Sitio/Purok:</label>
                      <Input 
                        type="text" 
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                    </div>
                  )}
                </form.Field>
              </div>

              <Button type="button" className="w-full mt-6" onClick={() => setStep(2)}>
                Next
              </Button>
            </div>
          )}

          {/* STEP 2: THE 74 QUESTIONS */}
          {step === 2 && (
            <div className="space-y-8">
              <h2 className="text-xl font-bold mb-3 border-b pb-2">II: Risk Assessment</h2>
              <p className="text-sm italic text-gray-600">Please answer for each indicator based on your family&apos;s experience.</p>

              {/* In a real scenario, you would .map() through your DB questions here */}
              <div className="p-4 border rounded-lg bg-gray-50">
                <p className="font-bold">1. Miscarriage (Pagkakunan)</p>
                <RadioGroup className="flex gap-4 mt-2">
                   <div className="flex items-center space-x-2">
                    <RadioGroupItem value="WITHIN_YEAR" id="q1-1" />
                    <label htmlFor="q1-1">Within the Year</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2_5_YEARS" id="q1-2" />
                    <label htmlFor="q1-2">2-5 Years Ago</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="NONE" id="q1-3" />
                    <label htmlFor="q1-3">None</label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700">Submit Assessment</Button>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  )
}