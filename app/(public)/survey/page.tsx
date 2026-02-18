"use client"
import { useEffect, useState } from 'react'
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
import { supabase } from '@/lib/supabase/client'

export interface Question {
  q_id: number;
  indicator_number: number;
  category: string;
  question_text: string;
  question_text_tagalog: string;
}

const surveySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  positionFamily: z.string().min(1, "Please select a position"),
  positionFamilyOther: z.string().optional(),
  barangay: z.string().min(1, "Please select a barangay"),
  sitioPurok: z.string().min(1, "Sitio/Purok is required"),
  numChildren: z.number().min(0),
  numFamHH: z.number().min(1, "At least 1 household member is required"),
  is4ps: z.string(),

  beneficiaryYear: z.string().optional(),

  q74OtherDescription: z.string().optional(),

  responses: z.array(
    z.object({
      q_id: z.number(),
      choice: z.string().min(1, "This question is required"),
    })
  ).length(74),
})
.superRefine((data, ctx) => {
  if (data.is4ps === "yes") {
    if (!data.beneficiaryYear) {
      ctx.addIssue({
        path: ["beneficiaryYear"],
        code: z.ZodIssueCode.custom,
        message: "Please select the starting date",
      });
      return;
    }

    const selectedDate = new Date(data.beneficiaryYear);
    const today = new Date();

    if (selectedDate > today) {
      ctx.addIssue({
        path: ["beneficiaryYear"],
        code: z.ZodIssueCode.custom,
        message: "Date cannot be in the future",
      });
    }
  }
});



export default function Page() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
  const fetchQuestions = async () => {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .order('indicator_number', { ascending: true });

    if (error) {
      console.error("Supabase Error:", error.message); // Check for permission errors
    } else {
      console.log("Fetched Questions:", data); // If this is [], your table is empty or name is wrong
      setQuestions(data);
    }
    setLoading(false);
  };
  fetchQuestions();
}, []);

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
      q74OtherDescription: '',
      responses: Array.from({ length: 74 }, (_, i) => ({
        q_id: i + 1,
        choice: ''
      }))
    },
    
    validators: {
      onChange: ({ value }) => {
        return surveySchema.safeParse(value);
      },
    },

    onSubmit: async ({ value }) => {
      try {
        // 1. Insert into 'respondents' using YOUR schema names
        const { data: resData, error: resError } = await supabase
          .from('respondents')
          .insert([{
            name: value.fullName, // Match 'name' from your SQL
            barangay: value.barangay,
            position_family: value.positionFamily === 'Other' ? value.positionFamilyOther : value.positionFamily,
            num_children: value.numChildren,
            num_families_in_hh: value.numFamHH, // Match your SQL name
            is_4ps_beneficiary: value.is4ps === 'yes', // Match your SQL name
            four_ps_since: value.is4ps === 'yes' && value.beneficiaryYear ? value.beneficiaryYear : null, // Match your SQL name
            q74_response: value.q74OtherDescription 
          }])
          .select()
          .single();

        if (resError) throw resError;

        // 2. Prepare the 73 answers (excluding 74)
        const batchResponses = value.responses
          .filter(r => r.q_id !== 74) 
          .map(r => ({
            respondent_id: resData.respondent_id, // Match 'respondent_id' from your SQL
            q_id: r.q_id,
            choice: r.choice // Ensure these match: 'WITHIN_THE_YEAR', 'TWO_FIVE_YEARS_AGO', 'NONE'
          }));

        // 3. Bulk insert
        const { error: batchError } = await supabase
          .from('responses')
          .insert(batchResponses);

        if (batchError) throw batchError;

        alert("Success! Data saved to Supabase.");
        window.location.reload();
        
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Error";
        alert(`Submission failed: ${errorMessage}`);
      }
    }
  })

  return (
    <main className="bg-[#FFFDF0] min-h-screen p-2 text-black">
      <div className="flex flex-col items-center mb-2">
        <LogoHeader />
        <h2 className="text-center font-bold">Municipal Social Welfare and Development Office Paniqui</h2>
        <h1 className="text-[2rem] font-bold text-center ">FAMILY SURVEY ON RISKS AND VULNERABILITY</h1>
      </div>
    
    <div className="bg-white border border-[#3405F9] p-8 w-full max-w-4xl mx-auto rounded-md shadow-sm">
        <form onSubmit={(e) => {
          e.preventDefault(); 
          e.stopPropagation();
          form.handleSubmit(); 
        }}>
        {/* STEP 1: FAMILY INFORMATION */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-3 border-b pb-2">I: Family Information</h2>
              {/* FULL NAME FIELD */}
              <form.Field 
                name="fullName"
                validators={{ onChange: z.string().min(2, "Required")}}
              >
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
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm mt-1">
                        {field.state.meta.errors.map(err => typeof err === 'object' ? err.message : err). join(',')}</p>
                    )}
                  </div>
                )}
              </form.Field>

              {/* POSITION IN THE FAMILY */}
              <form.Field 
                name="positionFamily"
                validators={{
                  onChange: z.string().min(1, "Please select a position"),
                }}  
              >
                {(field) => (
                  <div className="space-y-2">
                    <label className="font-bold text-black">Position in the family:</label>
                    <br />
                    <label className="font-light text-xs italic">Posisyon sa Pamilya</label>
                    <Select 
                      onValueChange={field.handleChange} 
                      value={field.state.value}
                    >
                      <SelectTrigger className={`w-full text-black ${
                        field.state.meta.errors.length > 0
                          ? "border-red-500 focus:ring-red-500"
                          : "border-[#3405F9]"
                      }`}>
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

                    {/* 🔴 Error Message */}
                    {field.state.meta.errors.length > 0 && (
                      <p className="text-red-500 text-sm">
                        {field.state.meta.errors
                          .map(err => typeof err === 'object' ? err.message : err)
                          .join(', ')}
                      </p>
                    )}
                    

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
              
              {/* NUMBER OF CHILDREN AND FAMILY MEMBERS */}
              <div className='grid grid-cols-2'>
              <form.Field name="numChildren">
                {(field) => (
                  <div>
                    <label className="font-bold">Number of Children:</label>
                    <br />
                    <label className="font-light text-xs italic">Bilang ng anak</label>

                    <Select
                      onValueChange={(val) => field.handleChange(Number(val))}
                      value={field.state.value.toString()}
                    >
                      <SelectTrigger
                        className={`w-full max-w-48 ${
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                            ? "border-red-500 focus:ring-red-500"
                            : "border-[#3405F9]"
                        }`}
                      >
                        <SelectValue placeholder="----" />
                      </SelectTrigger>

                      <SelectContent>
                        {[0,1,2,3,4,5,6,7,8,9,10,11].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num}
                          </SelectItem>
                        ))}
                        <SelectItem value="12">12+</SelectItem>
                      </SelectContent>
                    </Select>

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                  </div>
                )}
              </form.Field>


                <form.Field
                  name="numFamHH"
                >
                  {(field) => (
                    <div>
                      <label className="font-bold">
                        Number of Family Members in the Household:
                      </label>
                      <br />
                      <label className="font-light text-xs italic">
                        Bilang ng pamilya sa bahay
                      </label>

                      <Select
                        onValueChange={(val) => field.handleChange(Number(val))}
                        value={field.state.value.toString()}
                      >
                      <SelectTrigger
                        className={`w-full max-w-48 ${
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                            ? "border-red-500 focus:ring-red-500"
                            : "border-[#3405F9]"
                        }`}
                      >
                          <SelectValue placeholder="----" />
                        </SelectTrigger>

                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                          <SelectItem value="12">12+</SelectItem>
                        </SelectContent>
                      </Select>

                      {/* 🔴 Error */}
                      {field.state.meta.errors.length > 0 && (
                        <p className="text-red-500 text-sm mt-1">
                          {field.state.meta.errors.join(", ")}
                        </p>
                      )}
                    </div>
                  )}
                </form.Field>
                </div>
                {/* 4PS Beneficiary */}
              <div className="grid grid-cols-2 gap-4">
                 <form.Field name="is4ps">
                  {(field) => (
                    <div>
                      <label className="font-bold">Are you a 4ps beneficiary?</label>
                      <br />
                      <label className="font-light text-xs italic">4Ps Beneficiary ba?</label>

                      <Select
                        value={field.state.value}
                        onValueChange={(val) => {
                          field.handleChange(val);
                          if (val === "no") {
                            form.setFieldValue("beneficiaryYear", "");
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
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
                          <br />
                          <label className="font-light text-xs italic">
                            Kung OO kailan pa?
                          </label>

                          <Input
                            type="date"
                            disabled={is4ps === "no"}
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            className={`${
                              field.state.meta.errors.length > 0
                                ? "border-red-500 focus:ring-red-500"
                                : "border-[#3405F9]"
                            }`}
                          />

                          {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-sm mt-1">
                              {field.state.meta.errors.join(", ")}
                            </p>
                          )}
                        </div>
                      )}
                    </form.Subscribe>
                  )}
                </form.Field>
              </div>

                {/* BARANGAY AND SITIO/PUROK */}
              <div className="grid grid-cols-2 gap-4">
                 <form.Field name="barangay">
                  {(field) => (
                    <div>
                      <label className="font-bold">Barangay</label>

                      <Select 
                        onValueChange={field.handleChange} 
                        defaultValue={field.state.value}
                      >
                        <SelectTrigger className={`w-full max-w-48 ${field.state.meta.isTouched && field.state.meta.errors.length > 0
                          ? "border-red-500 focus:ring-red-500"
                          :"border-[#3405f9]"
                        }"`}>
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

                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>

                {/* Sitio/Purok */}
                <form.Field name="sitioPurok">
                  {(field) => (
                    <div>
                      <label className="font-bold">Sitio/Purok:</label>

                      <Input
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        className={`${
                          field.state.meta.isTouched &&
                          field.state.meta.errors.length > 0
                            ? "border-red-500 focus:ring-red-500"
                            : "border-[#3405F9]"
                        }`}
                      />

                      {field.state.meta.isTouched &&
                        field.state.meta.errors.length > 0 && (
                          <p className="text-red-500 text-sm mt-1">
                            {field.state.meta.errors.join(", ")}
                          </p>
                        )}
                    </div>
                  )}
                </form.Field>
              </div>

              <Button 
                type="button" 
                className="w-full mt-6" 
                onClick={async () => {
                  await form.handleSubmit();

                  if (!form.state.isValid) {
                    alert("Please fill out all required fields before proceeding to the survey.");
                    return;
                  }

                  setStep(2);
                  window.scrollTo(0, 0);
                }}
              >
                Next
              </Button>
            </div>
          )}

          {/* DYNAMIC CATEGORIES */}
          {categories.map((cat) => step === cat.id && (
            <div key={cat.id} className="space-y-6 animate-in fade-in duration-500">
              <div className="border-b pb-2 mb-4">
                <h2 className="text-xl font-bold text-[#3405F9]">Part {cat.id - 1}: {cat.label}</h2>
                <p className="text-sm italic text-gray-600">Pumili ng isa sa bawat katanungan.</p>
              </div>

              {loading ? (
                <div className="flex flex-col items-center justify-center p-10">
                  <Spinner />
                  <p className="text-sm text-gray-500 mt-2">Loading questions...</p>
                </div>
              ) : (
                // Filter questions by indicator range
                questions
                  .filter(q => q.indicator_number >= cat.range[0] && q.indicator_number <= cat.range[1])
                  .map((q) => (
                    <div key={q.q_id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                      <div>
                        <p className="font-bold text-black">{q.indicator_number}. {q.question_text}</p>
                        <p className="text-sm italic text-blue-700">{q.question_text_tagalog}</p>
                      </div>

                      {/* Remove RadioGroup for Q74 as per your request */}
                      {q.indicator_number !== 74 ? (
                        <form.Field name={`responses[${q.indicator_number - 1}].choice`}>
                          {(field) => (
                            <RadioGroup 
                              onValueChange={field.handleChange} 
                              value={field.state.value}
                              className="flex flex-col md:flex-row gap-4"
                            >
                              <div className="flex items-center space-x-2 bg-white p-2 rounded border flex-1">
                                <RadioGroupItem value="WITHIN_YEAR" id={`q${q.q_id}-1`} />
                                <label htmlFor={`q${q.q_id}-1`} className="text-sm cursor-pointer">Within the Year</label>
                              </div>
                              <div className="flex items-center space-x-2 bg-white p-2 rounded border flex-1">
                                <RadioGroupItem value="TWO_FIVE_YEARS_AGO" id={`q${q.q_id}-2`} />
                                <label htmlFor={`q${q.q_id}-2`} className="text-sm cursor-pointer">2-5 Years Ago</label>
                              </div>
                              <div className="flex items-center space-x-2 bg-white p-2 rounded border flex-1">
                                <RadioGroupItem value="NONE" id={`q${q.q_id}-3`} />
                                <label htmlFor={`q${q.q_id}-3`} className="text-sm cursor-pointer">None</label>
                              </div>
                            </RadioGroup>
                          )}
                        </form.Field>
                      ) : (
                        /* Question 74 Text Area only */
                        <form.Field name="q74OtherDescription">
                          {(field) => (
                            <div className="mt-2">
                              <label className="text-sm font-semibold text-gray-700 italic">
                                Pakisulat ang iba pang panganib (Please specify):
                              </label>
                              <Input 
                                placeholder="Type additional details here..."
                                value={field.state.value || ''}
                                onChange={(e) => field.handleChange(e.target.value)}
                                className="mt-2 border-[#3405F9] bg-white"
                              />
                            </div>
                          )}
                        </form.Field>
                      )}
                    </div>
                  ))
              )}

              <div className="flex gap-4 pt-6 border-t">
                <Button variant="outline" type="button" onClick={() => {
                  setStep(step - 1);
                  window.scrollTo(0, 0);
                }}>
                  Back
                </Button>
                
                {step < 5 ? (
                  <Button type="button" className="bg-[#3405F9]" onClick={() => {
                    setStep(step + 1);
                    window.scrollTo(0, 0);
                  }}>
                    Next Section
                  </Button>
                ) : (
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">
                    Submit Final Assessment
                  </Button>
                )}
              </div>
            </div>
          ))}
        </form>
      </div>
    </main>
  )
}