"use client"

import React from 'react'
import Link from 'next/link'

import { useState } from 'react'
import LogoHeader from './../../components/LogoHeader'

import { ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
function DataPrivacyPage() {

const [isChecked, setChecked] = useState(false);

  return (
  <main
    className='bg-center bg-no-repeat relative h-screen overflow-hidden'
    style={{ backgroundImage: "url('/Logo/Paniqui-Municipal-Hall.jpg')" }}
  >
    <div className='absolute inset-0 bg-black opacity-60'></div>

    <div className="h-screen flex items-center justify-center">

      <div className="flex flex-col gap-4 md:gap-5 lg:gap-2 items-center border-2 border-[#939393] p-4 max-h-[95vh] w-[90%] overflow-y-auto hide-scrollbar backdrop-blur-3xl rounded-3xl bg-gray-900/30">

        {/* Logo + Header */}
        <div className='flex justify-center gap-2 flex-col w-[95%]'>
          {LogoHeader()}
          <div className='text-center flex flex-col gap-1'>
            <h1 className='text-[1.2rem] sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.8rem] text-white font-bold'>
              MUNICIPALITY OF PANIQUI
            </h1>
            <p className='text-[0.65rem] sm:text-[0.75rem] md:text-[0.7rem] lg:text-[0.8rem] text-white font-light text-pretty'>
              Gomez Street, Poblacion Norte, Paniqui, Tarlac
              <br />
              <span>Email : mswdopaniqui2307@gmail.com</span>
              <br />
              <span>Telephone No. : (045) 931-2161 local 114</span>
            </p>
          </div>
        </div>

        <div className='font-light text-[0.65rem] sm:text-[0.75rem] md:text-[0.8rem] lg:text-[0.9rem] flex flex-col gap-2 px-4 sm:px-6 lg:px-10 text-justify text-pretty w-[80%]'>
          <p className='text-white'><span className='font-bold'>1.</span>  I certify that the information provided are <span className='font-bold'>true and correct</span> and I understand that I shall be held liable under all circumstances for any false information, misrepresentation and fraud in this application.
          <br />
          <span className='text-gray-100/90'>(Pinatutunayan ko na ang lahat ng impormasyong aking ibinigay ay totoo at wasto. Nauunawaan ko na ako ay mananagot sa ilalim ng batas sa anumang maling impormasyon, maling paglalahad, o pandaraya na aking nagawa kaugnay ng aplikasyon na ito.)</span>
          </p>

          <p className='text-white'><span className='font-bold'>2.</span> I authorize MSWDO PANIQUI to use and access my personal data and records submitted, which may be considered sensitive, to process my application for __________________________________ including verification from my source of such information and for the establishment, exercise or defense of MSWDO Paniqui legal claims against me in case I commit misrepresentation or fraud in the submission of this application.
          <br />
          <span className='text-gray-100/90'>(Ako ay nagbibigay ng pahintulot sa MSWDO Paniqui na gamitin, iproseso, at i-access ang aking personal na datos at mga rekord na aking isinumite, kabilang ang mga impormasyong itinuturing na sensitibo, para sa layunin ng pagproseso ng aking aplikasyon para sa ______________, kabilang ang beripikasyon mula sa pinanggalingan ng naturang impormasyon, at para sa pagtatatag, pagsasagawa, o pagtatanggol ng mga legal na karapatan ng MSWDO Paniqui sakaling ako ay magbigay ng maling impormasyon o magsagawa ng pandaraya sa pagsusumite ng aplikasyon.)</span>
          </p>

          <p className='text-white'><span className='font-bold'>3.</span> I agree that the information collected through this form shall be used and retained by the MSWDO- Paniqui for processing of my___________________________.
          <br />
          <span className='text-gray-100/90'>(Ako ay sumasang-ayon na ang mga impormasyong makokolekta sa pamamagitan ng form na ito ay gagamitin at itatago ng MSWDO Paniqui para sa pagproseso ng aking ______________.)</span>
          </p>

          <p className='text-white'><span className='font-bold'>4.</span> I trust that MSWDO Paniqui shall keep confidential and secure all the information using organizational, physical and technical measures and procedures, pursuant to the Data Privacy Act of 2012 (R.A. No. 10173). I was made aware that MSWDO Paniqui will not divulge my personal data to any person unless authorized by me or required through a subpoena issued by the courts. However, MSWDO Paniqui shall only share my data with other government agencies and with partner private companies like banks, collecting agents, insurance companies or IT solutions contractors through a data sharing agreement or as lawfully permitted under the applicable provision of R.A. No. 10173, for the purpose of delivering efficient and effective service and for the attainment of MSWDO Paniqui legal mandate of providing social security.
          <br />
          <span className='text-gray-100/90'>(Ako ay may tiwala na ang MSWDO Paniqui ay pananatilihing kumpidensyal at ligtas ang lahat ng aking personal na impormasyon sa pamamagitan ng angkop na organisasyonal, pisikal, at teknikal na mga hakbang at pamamaraan, alinsunod sa Data Privacy Act of 2012 (Republic Act No. 10173). Ipinabatid sa akin na hindi ibubunyag ng MSWDO Paniqui ang aking personal na datos sa sinumang tao maliban kung may pahintulot ko o kung kinakailangan sa pamamagitan ng subpoena na inilabas ng hukuman. Gayunpaman, maaari lamang ibahagi ng MSWDO Paniqui ang aking datos sa iba pang ahensya ng pamahalaan at sa mga katuwang na pribadong kompanya tulad ng mga bangko, collecting agents, insurance companies, o IT solutions contractors, sa pamamagitan ng isang data sharing agreement o kung pinahihintulutan ng batas sa ilalim ng R.A. No. 10173, para sa layunin ng pagbibigay ng episyente at epektibong serbisyo at sa pagtupad ng legal na mandato ng MSWDO Paniqui sa pagbibigay ng serbisyong panlipunan.)</span>
          </p>

          <p className='text-white'><span className='font-bold'>5.</span> I understand that, while MSWDO Paniqui is committed to ensuring the safety and security of my personal data, no method of transmission over the internet or method of electronic storage will guaranty absolute security. Nevertheless, MSWDO Paniqui commits that all the forms used in collecting my information shall be disposed of in accordance with MSWDO Paniqui Records Retention and Disposition Schedule to insure against unnecessary disclosure of information.
          <br />
          <span className='text-gray-100/90'>(Nauunawaan ko na bagama&apos;t ang MSWDO Paniqui ay nagsusumikap na matiyak ang kaligtasan at seguridad ng aking personal na datos, walang anumang paraan ng transmisyon sa internet o elektronikong pag-iimbak ang makapagbibigay ng ganap na garantiya ng seguridad. Gayunpaman, ang MSWDO Paniqui ay nangangakong ang lahat ng mga form na ginamit sa pangangalap ng aking impormasyon ay itatapon alinsunod sa Records Retention and Disposition Schedule ng MSWDO Paniqui upang maiwasan ang hindi kinakailangang pagbubunyag ng impormasyon.)</span>
          </p>
        </div>

        {/* Checkbox */}
        <div className='flex gap-2 items-center'>
          <input
            type="checkbox"
            id="Agree"
            className='cursor-pointer w-4 h-4'
            checked={isChecked}
            onChange={(e) => setChecked(e.target.checked)}
          />
          <label htmlFor="Agree" className='hover:cursor-pointer text-white text-[0.75rem] sm:text-[0.85rem] lg:text-[1rem]'>
            I agree
          </label>
        </div>

        {/* START Button */}
        <Link href={'/survey'} className='w-[50%] sm:w-[35%] md:w-[25%] lg:w-[20%]'>
          <Button
            disabled={!isChecked}
            className={`rounded-md w-full py-5 flex items-center justify-center
                        text-white font-bold text-[0.8rem] sm:text-[0.9rem] lg:text-[1rem]
                        transition-colors duration-200
                        ${isChecked
                          ? "bg-[#fffb00]  text-2xl text-black font-bold hover:bg-[#9d7f03] hover:text-white cursor-pointer"
                          : "bg-gray-600 cursor-not-allowed"
                        }`}
          >
            <ChevronRightIcon size={20} className='mr-1' />
            START
          </Button>
        </Link>

        {/* Disclaimer */}
        <p className='text-[0.55rem] sm:text-[0.6rem] lg:text-[0.8rem] text-center
                      w-[90%] lg:w-[60%] pb-2 text-gray-300/70 font-extralight'>
          All data and information indicated herein shall be used for identification
          purposes for the implementation of disaster risk reduction and management
          (DRRM) programs, projects, and activities and its disclosure shall be in
          compliance to Republic Act 10173 (Data Privacy Act of 2012).
        </p>

      </div>{/* Panel Blur */}
    </div>
  </main>
  )
}

export default DataPrivacyPage