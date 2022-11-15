import React from 'react'
import { useState } from 'react'
import swal from 'sweetalert';
import instance from './instances/instance';
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const ForgetPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [error, setError] = useState({});
    const navigate = useNavigate();

    const verifyInBack = async () => {
        const res = await instance.post('/auth/forgetPassword', {
            email : email,
        })
        if (res.data.status === 0)
        {
            swal({
                title: "Noooooop!!",
                text: `${res.data.error} Please Enter a valid email`,
                icon: "error",
                buttons: "close",         
            })
        }
        else {
            swal({
                title: "Yeeeeeeeep!!",
                text: "We sent Instructions to your Email to reset your password",
                icon: "success",
                buttons: "close"
            })
            navigate("/signIn");
        }
    }

    const validateEmail = () => {
        const errors = {}
        const regex = /^([a-zA-Z._0-9-]+)@([a-zA-Z0-9]+[.]?)*([a-zA-Z0-9])(\.[a-zA-Z]{2,4})$/i;
        if (!email) {
            errors.email = "email name is required!"
        } else if (!regex.test(email) ) {
            errors.email = "This is not a valid email format!"
        }
        if (Object.keys(errors).length === 0) {
            return false;
        }
        return (errors);
    }

    const sendInstructions = async () => {
        const err = validateEmail();
        if(err)
            setError(err)
        else {
            setError({});
            await verifyInBack();
        }
    }
  return (
    <div className='h-screen w-full flex items-center justify-center sm:justify-end sm:pr-[20%]'>
        <div className='flex flex-col max-w-[200px] xs:max-w-[300px] sm:max-w-[400px]'>
            <div className='justify-end mb-8 items-end flex '>
                <div className='w-80 text-right'>
                    <h1 className='text-3xl xs:text-5xl font-bold text-white'>{t('forgetPassword')}</h1>
                </div>
            </div>
            <div className='text-center mb-8'>
                <h1 className='text-white text-xs'>{t('forgetPasswordText')}</h1>
            </div>
            <input type="text" name="Email" placeholder='Email' className='input-gray ' value={email} onChange={(e) => setEmail(e.target.value)}/>
            <h1 className='flex text-sm text-red-600 mb-3'>{error.email}</h1>
            <button className='rounded-sm text-xs xs:text-lg' onClick={sendInstructions}>{t('Send Reset Instructions')}</button>
        </div>
    </div>
  )
}

export default ForgetPassword