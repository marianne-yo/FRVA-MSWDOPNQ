import Image from 'next/image'
import Link from 'next/link';
import LogoHeader from './../components/LogoHeader';

export default function Home() {
  return (
    <main className=''>
    <div className="h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center" 
    style={{ backgroundImage: "url('/Logo/Paniqui-Municipal-Hall.jpg')" }}>
      <div className='absolute inset-0 bg-black opacity-60'></div>

    <div className="flex flex-col lg:gap-7 md:gap-6 gap-5 items-center border-2 border-[#939393] shadow-xl p-4 md:h-[80%] lg:h-[74%] h-[60%] lg:w-[45%] md:w-[45%] w-[80%] backdrop-blur-md rounded-3xl text-shadow-black text-shadow-2xs">

{LogoHeader()}

    <div className='text-center flex flex-col gap-2'>
      <h1 className='text-[0.8rem] md:text-[1.5rem] lg:text-[1.8rem] text-white'>MUNICIPALITY OF PANIQUI</h1>
      <p className='text-[0.5rem] md:text-[0.7rem] lg:text-[0.8rem] text-white'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta placeat nemo vero provident assumenda saepe non labore autem! Sunt libero laudantium animi fugiat quasi nulla beatae delectus consequatur, quaerat adipisci.</p>
    </div>


    <div className='flex flex-col  p-5 gap-4 lg:w-[55%] w-full '>
      <Link href={'/DataPrivacy'}><button className='lg:p-4 md:p-3 p-2 w-full rounded-[5px] bg-[#FF4549] cursor-pointer hover:bg-[#e2191c] text-[0.6rem] md:text-[0.8rem] lg:text-[1rem] text-white'>TAKE SURVEY</button></Link>
      <button className='lg:p-4 md:p-3 p-2 w-full rounded-[5px] cursor-pointer bg-[#FFAE35] hover:bg-[#e08d11] text-[0.6rem] md:text-[0.8rem] lg:text-[1rem] text-black'>LOGIN AS ADMIN</button>
    </div>
    <div className='text-center flex flex-col gap-2'>
      <p className='text-[0.5rem] md:text-[0.7rem] lg:text-[0.8rem] text-white'>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta placeat nemo vero provident assumenda saepe non labore autem! Sunt libero laudantium animi fugiat quasi nulla beatae delectus consequatur, quaerat adipisci.</p>
    </div>

    <a
      className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
      href="/admin/summary"
      target="_blank"
      rel="noopener noreferrer"
    >
      Admin Test
    </a>

    </div>
  </div>
</main>
  );
}