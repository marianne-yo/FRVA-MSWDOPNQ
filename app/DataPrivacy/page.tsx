"use client"

import React from 'react'
import Link from 'next/link'

import { useState } from 'react'
import LogoHeader from './../../components/LogoHeader'

function DataPrivacyPage() {

const [isChecked, setChecked] = useState(false);

  return (
    <main className='bg-center overflow-hidden relative bg-opacity-10 bg-no-repeat'style={{ backgroundImage: "url('/Logo/Paniqui-Municipal-Hall.jpg')" }}>
      <div className='absolute inset-0 bg-black opacity-60'></div>
        <div className="h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center" >

    <div className="flex flex-col lg:gap-2 md:gap-5 gap-4 items-center border-2 border-[#939393] shadow-xl p-4 h-[95%] w-[90%] backdrop-blur-md rounded-3xl overflow-scroll lg:overflow-hidden">

      <div className='flex justify-center gap-2 flex-col w-[95%]'>
{LogoHeader()}
      <div className='text-shadow-black text-shadow-2xs'>
        <h1 className='text-center font-bold lg:text-[1.5rem] text-[0.9rem] text-white'>MUNICIPAL SOCIAL WELFARE AND DEVELOPMENT OFFICE</h1>
        <p className='text-[0.6rem] lg:text-[0.8rem] text-center text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <p className='text-[0.6rem] lg:text-[0.8rem] text-center text-white'>Lorem ipsum dolor sit amet consectetur</p>
        <p className='text-[0.6rem] lg:text-[0.8rem] text-center text-white'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
      </div>
      </div>

<div className='font-extralight text-[0.8rem] text-shadow-black text-shadow-2xs flex flex-col gap-2 p-5 pl-10 pr-10 text-justify'>
  <p className='text-white'><span className='font-bold'>1.</span>  certify that the information provided are  <span className='font-bold'>true and correct</span> and I understand that I shall be held liable under all circumstances for any false information, misrepresentation and fraud in this application.</p>
  <p className='text-white'><span className='font-bold'>2.</span> I authorize MSWDO PANIQUI  to use and access my personal data and records submitted, which may be considered sensitive, to process my application for __________________________________ including verification from my source of such information and for the establishment, exercise or defense of MSWDO Paniqui   legal claims against me in case I commit misrepresentation or fraud in the submission of this application. </p>
  <p className='text-white'><span className='font-bold'>3.</span> I agree that the information collected through this form shall be used and retained by the MSWDO- Paniqui for processing of my___________________________.</p>
  <p className='text-white'><span className='font-bold'>4.</span> I trust that MSWDO Paniqui shall keep confidential and secure all the information using organizational, physical and technical measures and procedures, pursuant to the Data Privacy Act of 2012 (R.A. No. 10173). I was made aware that MSWDO Paniqui will not divulge my personal data to any person unless authorized by me or required through a subpoena issued by the courts. However, MSWDO Paniqui shall only share my data with other government agencies and with partner private companies like banks, collecting agents, insurance companies or IT solutions contractors through a data sharing agreement or as lawfully permitted under the applicable provision of R.A. No. 10173, for the purpose of delivering efficient and effective service and for the attainment of MSWDO Paniqui legal mandate of providing social security.</p>
  <p className='text-white'><span className='font-bold'>5.</span> I understand that, while MSWDO Paniqui is committed to ensuring the safety and security of my personal data, no method of transmission over the internet or method of electronic storage will guaranty absolute security. Nevertheless, MSWDO Paniqui commits that all the forms used in collecting. my information shall be disposed of in accordance with MSWDO Paniqui Records Retention and Disposition Schedule to insure against unnecessary disclosure of information. </p>
</div>
<div className='flex gap-2 '>
  <input type="checkbox" name="" id="Agree" className='cursor-pointer' 
  checked ={isChecked}
  onChange={(e)=> setChecked(e.target.checked)}
  />
<label htmlFor="Agree" className='hover:cursor-pointer text-white'>I agree</label>
</div>


<Link
className='w-[20%] h-[7%]'
href={'/survey'}>
<button
disabled={!isChecked}
className={`rounded-[5px]  flex w-full h-full items-center justify-center
  ${isChecked ? "bg-[#FF3539] hover:bg-[#e2191c] cursor-pointer":"bg-gray-600 cursor-not-allowed"}`}>START
  </button>
  </Link>

<p className='lg:text-[0.8rem] text-[0.6rem] text-center lg:w-[60%] w-full mt-2 text-white'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Atque sapiente laudantium quasi illum placeat fugiat deserunt facere. Sed sunt, atque ullam doloribus vero repudiandae, sint deserunt numquam porro fugiat distinctio!</p>

    </div>{/* Panel Blur */}
        </div>
    </main>
  )
}

export default DataPrivacyPage