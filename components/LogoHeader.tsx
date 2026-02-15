import React from 'react'
import Image from 'next/image'
function LogoHeader() {
  return (
            <div className='flex w-full justify-center gap-3 p-2'>
            <Image
              src="/Logo/PhLogo.png"
              alt="Bagong Pilipinas Logo"
              width={80}
              height={80}
              className="object-contain">
            </Image>
            <Image
              src="/Logo/PanLogo.png"
              alt="Paniqui Logo"
              width={80}
              height={80}
              className="object-contain">
              </Image>
            <Image
              src="/Logo/MSWDOLogo.png"
              alt="MSWDO Logo"
              width={80}
              height={80}
              className="object-contain"
            ></Image>
            </div>
  )
}

export default LogoHeader