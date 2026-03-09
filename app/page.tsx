"use client"
import Image from 'next/image'
import Link from 'next/link';
import LogoHeader from './../components/LogoHeader';
import { useState } from 'react';

import Popups from '@/components/Popups';
import { Button } from '@/components/ui/button';
import { ClipboardList, UserIcon } from 'lucide-react';

export default function Home() {
  const [open,isOpen] = useState(false);

  return (
    <main className=''>
    <div className="h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center max-w-full" 
    style={{ backgroundImage: "url('/Logo/Paniqui-Municipal-Hall.jpg')" }}>
      <div className='absolute inset-0 bg-black opacity-70'></div>

    <div className="flex flex-col lg:gap-7 md:gap-6 sm:gap-5 items-center border-2 justify-center border-[#c9c9c9] shadow-xl p-4  w-[80%] lg:w-[50%] md:w-[65%] sm:w-[70%] backdrop-blur-xl rounded-3xl bg-gray-500/30">

{LogoHeader()}

    <div className='text-center flex flex-col gap-1'>
      <h1 className='text-[1.5rem] sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.8rem] text-white font-bold'>MUNICIPALITY OF PANIQUI</h1>
      <p className='text-[0.8rem] sm:text-[0.75rem] md:text-[0.7rem] lg:text-[0.8rem] text-white font-light text-pretty'>
        Gomez Street, Poblacion Norte, Paniqui, Tarlac
        <br />
        <span>Email : mswdopaniqui2307@gmail.com</span>
        <br />
        <span>Telephone No. : (045) 931-2161 local 114</span>
      </p>
    </div>

    <Popups
    isOpen={open}
    onclose={()=>isOpen(false)}
    ></Popups>

    <div className='flex flex-col p-5 gap-4 lg:w-[55%] w-full '>
      <Link href={'/DataPrivacy'}>
        <Button size={"icon-lg"} className='p-6 lg:p-8 md:p-8 sm:p-8 w-full rounded-[5px] bg-[#FF4549] cursor-pointer hover:bg-[#e2191c] text-[1rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.2rem] font-bold text-white'>
          <ClipboardList size={30} />
          TAKE SURVEY
        </Button>
      </Link>

      <Button size={"icon-lg"} className='p-6 lg:p-8 md:p-8 sm:p-8 w-full rounded-[5px] cursor-pointer bg-[#ff9c07] hover:bg-[#e08d11] text-[1rem] sm:text-[0.9rem] md:text-[1rem] lg:text-[1.2rem] text-white font-bold' onClick={() => (isOpen(true))}>
        <UserIcon size={30} />
        LOGIN AS ADMIN
      </Button>
    </div>

    <div className='text-center flex flex-col gap-2 mt-2'>
      <p className='text-[0.7rem] sm:text-[0.7rem] md:text-[0.7rem] lg:text-[0.8rem] text-gray-300/70 font-extralight'>All data and information indicated herein shall be used for identification purposes for the implementation of disaster risk reduction and management (DRRM) programs, projects, and activities and its disclosure shall be in compliance to Republic Act 10173 (Data Privacy Act of 2012).</p>
    </div>

    </div>
  </div>
</main>
  );
}