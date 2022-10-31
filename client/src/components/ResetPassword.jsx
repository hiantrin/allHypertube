import React, { useState } from 'react'
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';
import instance from './instances/instance';

const ResetPassword = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const verifyToken = async () => {
            const res = await instance.post('/auth/confirm', {
                token: slug,
                type: 2,
              });
            if (res.data.status === 0)
            {
                swal({
                    title: "Ooooooops!!",
                    text: "Something went wrong!",
                    icon: "error",
                    buttons: "close"
                })
                navigate("/signIn")
            }
            else {
                localStorage.setItem('resetToken', slug)
            }
        }
        verifyToken();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    const initial = {
        password: "",
        confirmPassword: ""
    }
    const [infos, setInfos] = useState(initial);
    const [error, setError] = useState({})
    const sendPassBack = async () => {
        const res = await instance.post('/auth/resetPassword', {
            ...infos,
            token: slug,
            type : 2,
        })
        if (res.data.status === 0) {
            swal({
                title:"Ooooooooops",
                text: "Something Went Wrong Please Try again later",
                icon: "error",
                buttons: "close"
            })
            localStorage.removeItem('resetToken')
            navigate('/signIn');
        } else {
            swal({
                title:"Yeeeeeeep",
                text: res.data.data,
                icon: "success",
                buttons: "close"
            })
            localStorage.removeItem('resetToken')
            navigate('/signIn')
        }
    }
    const validatePass = () => {
        const errors= {};
        const passregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\\[\]|\\:;"'<>,.?/_₹])/i;
        const lenghtregex = /^.{7,20}$/i;
        if (!infos.password) {
            errors.password = "password  is required!"
        }else if (!passregex.test(infos.password)) {
			errors.password = "password must contain special character numbers lowercase and Uppercase"
		} else if (!lenghtregex.test(infos.password))
		{
			errors.password = "password must be 7-16 characters long."
		}
		if (!infos.confirmPassword){
			errors.confirmPassword = "Please Reenter your password"
		} else if (infos.confirmPassword !== infos.password) {
			errors.confirmPassword = "doesnt match with your password"
		}
        if (Object.keys(errors).length === 0) {
            return false;
        }
        return errors;
    }

    const resetPassword = async () => {
       const err = validatePass()
       if (err) {
            setError(err);
       }
       else {
            setError({})
            await sendPassBack();
       }
    }
  return (
    <div className='h-screen w-full flex items-center justify-center sm:justify-end sm:pr-[20%]'>
        <div className='flex flex-col w-[250px] xs:w-[350px]'>
            <div className='flex flex-col text-right mb-8 '>
                <h1 className='text-3xl xs:text-5xl font-bold text-white'>Reset</h1>
                <h1 className='text-3xl xs:text-5xl font-bold text-white'>Password !</h1>
            </div>
            <div className='text-center mb-8'>
                <h1 className='text-white text-xs xs:text-sm'>Please Enter Your New Password :</h1>
            </div>
                <input type="password" name="Password" placeholder='Password' className='input-gray' value={infos.password} onChange={(e) => setInfos({...infos, password : e.target.value})} />
                <h1 className='flex text-xs text-red-600 mb-3'>{error.password}</h1>
                <input type="password" name="confirmPassword" placeholder='Confirm New Password' className='input-gray ' value={infos.confirmPassword} onChange={(e) => setInfos({...infos,  confirmPassword : e.target.value})} />
                <h1 className='flex text-xs text-red-600 mb-3'>{error.confirmPassword}</h1>
            <button className='rounded-sm text-xs xs:text-lg' onClick={resetPassword}>Change Password</button>
        </div>
    </div>
  )
}

export default ResetPassword