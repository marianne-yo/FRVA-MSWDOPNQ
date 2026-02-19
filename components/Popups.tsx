    'use client'

    import React from 'react'
    import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
    import { Input } from './ui/input';
    import { Button } from './ui/button';
    import { useState } from 'react';

    import { supabase } from '@/lib/supabase/client';
    import { useRouter } from 'next/navigation';

    import { toast } from "sonner"


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
            <Card className='bg-cover p-3 gap-2 bg-center bg-no-repeat border relative lg:w-[40%] md:w-[40%] w-[80%] h-[40%] flex flex-col items-center bg-white text-black '>
                <CardTitle className='text-[1rem]'>LOGIN AS ADMIN</CardTitle>
                <button
                className='absolute right-3 top-1 cursor-pointer'
                onClick={onclose}>
                X</button>
                
                <CardContent className='flex flex-col w-[90%] p-2 h-[55%] gap-5 justify-center'>
                    <Input
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)} 
                    type='text' 
                    placeholder='Email' />
                     
                    <Input
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)} 
                    type='password' 
                    placeholder='Password' />
                </CardContent>
                <Button
                disabled={loading}
                onClick={handleSubmit}
                 className='border w-[50%] p-2 cursor-pointer rounded'>
                    
                  {loading && <Spinner className="h-4 w-4" />}
                  {loading ? "Logging in..." : "LOGIN"}
                </Button>
                <p></p>
            </Card>
        </div>
    )
    }

    export default Popups