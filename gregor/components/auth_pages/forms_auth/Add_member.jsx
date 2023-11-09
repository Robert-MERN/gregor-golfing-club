import Image from 'next/image'
import React from 'react'
import Fade from "react-reveal/Fade";
import Add_member_form_admin from '../Add_member_form_admin';
import useStateContext from '@/context/ContextProvider';
import { getCookie } from 'cookies-next';
import style from "@/styles/Home.module.css";
import Edit_member_admin from '../Edit_member_admin';





const Adding_member = ({ CJS_KEY }) => {

    const { } = useStateContext();


    return (
        <div className='w-full h-[calc(100vh-60px)]' >

            <Fade duration={500} >
                <div className={`w-full h-full  overflow-y-auto ${style.scrollBar} px-[20px]`} >

                    <div className='flex md:flex-row flex-col h-full md:pt-[65px]' >
                        <Fade duration={500} >
                            <div className='flex-1 grid place-items-center'>
                                <Add_member_form_admin />
                            </div>
                            <div className='flex-1 place-items-center lg:grid' >
                                <Edit_member_admin />
                            </div>
                        </Fade>
                    </div>

                </div >
            </Fade>
        </div >
    )
}

export default Adding_member