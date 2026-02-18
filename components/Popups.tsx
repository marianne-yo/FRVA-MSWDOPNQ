'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

type popUpsProps ={
    isOpen: boolean;
    onclose: ()=>void;
}


function Popups({isOpen,onclose}: popUpsProps) {
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
                <Input type='text' placeholder='Email' />
                <Input type='password' placeholder='Password' />
            </CardContent>
            <Button className='border w-[50%] p-2 cursor-pointer rounded'>
                LOGIN
            </Button>
            <p></p>
        </Card>
    </div>
  )
}

export default Popups