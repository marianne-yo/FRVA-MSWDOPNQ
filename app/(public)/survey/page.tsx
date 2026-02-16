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
  const [step, setStep] = useState(1)

  const form = useForm({
    defaultValues: {
      fullName: '',
      positionFamily: '',
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
        <h1 className="text-[2rem] font-bold text-center mt-5">FRVA Form</h1>
      </div>

      <div className="bg-white border border-[#3405F9] p-8 w-full max-w-4xl mx-auto rounded-xl">
        <h2 className="text-xl font-bold mb-3 border-b pb-2 text-black">I: Family Information</h2>

        <form action="">
          <label htmlFor="fullName" className='font-bold'>Full Name:</label>
          <Input type='text' id='fullName'/>

          {/* Position inf the family */}
          <label htmlFor="positionFamily" className='font-bold'>Position in the family:</label>
          <Input type='text' id='positionFamily'/>

          {/* number of children */}

          <label htmlFor="numChildren" className='font-bold'>Number of Children:</label>
          <Input type='number' id='numChildren'/>

          {/* number of family in the household */}
          <label htmlFor="numFamHH" className='font-bold'>Number of family in the household:</label>
          <Input type='number' id='numFamHH'/>

          {/* 4ps Beneficiary, this links to the since when beneficiary. Default is disabled */}
          <FieldGroup className='grid w-full grid-cols-2 '>
            <Field>
              <FieldLabel htmlFor='beneficiary' className='font-bold'>Are you a 4ps beneficiary?</FieldLabel>
                <Select>
                  <SelectTrigger className="w-full max-w-48">
                    <SelectValue placeholder="----" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select</SelectLabel>
                      <SelectItem value="yes">YES</SelectItem>
                      <SelectItem value="no">NO</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor='beneficiaryYear' className="font-bold">If YES, since when have you been a beneficiary of 4Ps?</FieldLabel>
              <Input type='number' id='beneficiaryDate' disabled={true}/>
            </Field>
          </FieldGroup>

          {/* barangay */}
          <label htmlFor="barangay" className='font-bold'>Barangay:</label>
          <Select>
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

          {/* sitio/purok */}
          <label htmlFor="sitioPurok" className='font-bold'>Sitio/Purok:</label>
          <Input type='text' id='sitioPurok'/>
          
        </form>
          <br />
          <Button 
            variant={'default'}
            size={'lg'}
          >
            Next
          </Button>
      </div>
    </main>
  )
}