    'use client'

    import React from 'react'
    import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
    import { Input } from './ui/input';
    import { Button } from './ui/button';
    import { useState } from 'react';

    import { supabase } from '@/lib/supabase/client';
    import { useRouter } from 'next/navigation';

    import { toast } from "sonner"
    import { IoEye,IoEyeOff } from "react-icons/io5";
    
    import { X } from 'lucide-react';


    import { Spinner } from "@/components/ui/spinner"
    import { set } from 'zod/v4';

    type popUpsProps ={
        isOpen: boolean;
        onclose: ()=>void;
    }
    function Popups({isOpen,onclose}: popUpsProps) {

        const router = useRouter();
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [loading, setLoading] = useState(false);


        const [show, setShow] = useState(false)

async function handleSubmit (){


    if(!email || !password){
        toast.error("Enter Email and Password")
        return
    }

setLoading(true);
    const {error} = await supabase.auth.signInWithPassword({
        email,
        password,
    })

       if (error) {
      toast.error("Invalid Credentials")
        setLoading(false);
      setEmail("");
      setPassword("");
    } else {
      onclose()
      router.push('/admin/summary')
      setLoading(false);
    }

}


        if(!isOpen) return null    
    return (
        <div className='inset-0 z-50 fixed flex items-center justify-center'>
            <Card className='bg-cover p-3 gap-2 bg-center bg-no-repeat border relative lg:w-[50%] md:w-[60%] sm:w-[70%] w-[90%] flex flex-col items-center bg-white text-black '>
                <CardTitle className='text-[1rem] sm:text-[1.25rem] md:text-[1.25rem] lg:text-[1.5rem] font-bold'>LOGIN AS ADMIN</CardTitle>
                <button
                className='absolute right-3 top-3 cursor-pointer'
                onClick={onclose}>
                <X size={20}/></button>
                
                <CardContent className='flex flex-col w-[90%] p-2 h-[60%] sm:h-[70%] md:h-[75%] lg:h-[80%] gap-5 justify-center'>
                    <Input
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    type='text' 
                    placeholder='Email'
                    className='text-black text-md'
                    />
                     
                <div className='relative w-full'>
                    <Input
                    className='pr-10 text-black text-lg sm:text-md md:text-md lg:text-lg'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    type={show ? "text":"password"} 
                    placeholder='Password' />
                    
                    {show ?(<IoEyeOff
                    onClick={()=>setShow(false)}
                    className='text-black absolute right-1.5 top-2.5 cursor-pointer' />):
                    (<IoEye 
                    onClick={()=>setShow(true)}
                    className='text-black absolute right-1.5 top-2.5 cursor-pointer' />)}

                </div>
                  
                    
                </CardContent>
                <Button
                variant={'outline'}
                disabled={loading}
                onClick={handleSubmit}
                 className='border w-[70%] sm:w-[75%] md:w-[80%] lg:w-[85%] border-gray-300 bg-yellow-400 hover:bg-yellow-200 p-2 active:bg-yellow-400 active:text-white text-gray-900 ursor-pointer rounded-full'>
                    
                  {loading && <Spinner className="h-4 w-4" />}
                    {loading ? "Logging in..." : <span className="font-bold tracking-widest text-sm">LOGIN</span>}
                </Button>
                <p></p>
            </Card>
        </div>
    )
    }

    export default Popups