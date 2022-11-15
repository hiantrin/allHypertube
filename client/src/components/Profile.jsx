import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faKey } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import img from "../images/it.jpeg"
import {  useDispatch, useSelector } from 'react-redux';
import { addUserData, getUserData } from './redux/reducers/userSlice'
import { useState } from 'react'
import Lottie from "lottie-react";
import camera from "../images/5705-camera.json"
import swal from 'sweetalert'
import { useEffect } from 'react'
import instance from './instances/instance'
import ModalImage from './modal/ModalImage'
import { useTranslation } from 'react-i18next'


const Profile = () => {
    const dispatch = useDispatch()
    const authToken = localStorage.getItem('authToken')
    const data = useSelector(getUserData)
    const { t } = useTranslation();
    const imgs = [
        img,
        img,
        img
    ]
    const infos = [
       data.username,
       data.firstName,
       data.lastName,
       data.email,
    ]
    const [userInfo, setUserInfo] = useState({})
    const [update, setUpdate] = useState(0)
    const [avatar, setAvatar] = useState(null)
    const [oldAvatar, setOldAvatar] = useState(null)
    const [errors, setErrors] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [pass, setPass] = useState({
        password: "",
        confPassword: "",
    })

    const validatePass = () => {
        const passregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\\[\]|\\:;"'<>,.?/_₹])/i;
		const lenghtregex = /^.{7,20}$/i;
        const error = {}

        if (!pass.password) {
            error.password = "password  is required!"
        }else if (!passregex.test(pass.password)) {
			error.password = "password must contain special character numbers lowercase and Uppercase"
		} else if (!lenghtregex.test(pass.password))
		{
			error.password = "password must be 7-16 characters long."
		}
		if (!pass.confPassword){
			error.confPassword = "Please Reenter your password"
		} else if (pass.confPassword !== pass.password) {
			error.confPassword = "doesnt match with your password"
		}
        if (Object.keys(error).length === 0) {
            return false;
        }
        return error;
    }

    const changePassword = async (e) => {
        e.preventDefault();
        const err = validatePass();
        if (err)
            setErrors(err)
        else {
            setErrors({})
            await changePassinBack();
        }
    }

    const changePassinBack = async () => {
        const res = await instance.post('/auth/resetPassword', {
            password: pass.password,
            token: authToken,
            type : 0,
        })
        if (res.data.status === 0) {
            swal({
                title:"Ooooooooops",
                text: "Something Went Wrong Please Try again later",
                icon: "error",
                buttons: "close"
            })
            setUpdate(0)
            setPass({password: "", confPassword: "",})
        } else {
            swal({
                title:"Yeeeeeeep",
                text: res.data.data,
                icon: "success",
                buttons: "close"
            })
            setUpdate(0)
            setPass({password: "", confPassword: "",})
        }
    }
    const updateInfos = async () => {
        if (update === 1)
            setUpdate(0)
        else
            setUpdate(1)
        setErrors({})
        setUserInfo({
            username : data.username,
            firstName : data.firstName,
            lastName : data.lastName,
            email: data.email,
        })
    }
    const validate = () => {
        const errors= {};
        const regex = /^([a-zA-Z._0-9-]+)@([a-zA-Z0-9]+[.]?)*([a-zA-Z0-9])(\.[a-zA-Z]{2,4})$/i;
        if (!userInfo.firstName) {
            errors.firstName = "First name is required !"
        } else if (Object.keys(userInfo.firstName).length < 3 ) {
            errors.firstName = "your first name must contain at least 3 characters"
        }
        if (!userInfo.lastName) {
            errors.lastName = "last name is required!"
        } else if (Object.keys(userInfo.lastName).length < 3 ) {
            errors.lastName = "your last name must contain at least 3 characters"
        }
        if (!userInfo.username) {
            errors.username = "Username is required!";
        } else if (Object.keys(userInfo.username).length < 3 ) {
            errors.username = "your username must contain at least 3 characters"
        }
        if (!userInfo.email) {
            errors.email = "email name is required!"
        } else if (!regex.test(userInfo.email) ) {
            errors.email = "This is not a valid email format!"
        }
        if (Object.keys(errors).length === 0) {
            return false;
        }
        return errors;
    }

    const sendToBack = async () => {
        const res = await instance.post("/user/changeInfos", {
               ...userInfo,
               avatar: avatar,
               token: authToken,
               type: 0
        })
        if (res.data.status === 0)
        {
            swal({
                title: "Ooooooooooooops!!",
                text: res.data.error,
                icon: "warning",
                buttons: "close"
            })
            setUpdate(0)
        } else {
            swal({
                title: "Yeeeeeeeeeeeep",
                text: res.data.data.message,
                icon: "success",
                buttons: "close"
            })
            setUpdate(0)
            dispatch(addUserData({...userInfo, avatar: avatar}))
            localStorage.setItem('authToken', res.data.data.token)
        }
    }

    const changeInfos = async (e) => {
        e.preventDefault();
        const err = validate()
        if (err) {
            setErrors(err)
        } else {
            setErrors({})
            await sendToBack();
        }
    }

    const uploadImg = () => {
        const Add1 = document.getElementById('Avatar');
        Add1.click();
    }

    const handleUpload = (e) => {
        const File = e.target.files[0];
        const Filereader = new FileReader();
        const imageMimeType = /image\/(png|jpg|jpeg)/i;

        if (!File) {
            swal({
                title: 'OUCHHHHH!',
                text: 'Please select an image',
                icon: 'error',
                buttons : 'close',
            })
            return false;
        }
        if (!File.type.match(imageMimeType)) {
            swal({
                title : 'OUCHHHHHH!',
                text : 'Please select an image',
                icon: 'error',
                buttons : 'close',
            })
            return false;
        }
        Filereader.onload = e => {
			const img = new Image();
			img.onload = () => {};
			img.onerror = () => {
				swal({
					title: 'OUUUUUUCH!',
					text: `Invalid image content.`,
					icon: 'warning',
					confirmButtonText: 'close'
				});
				return false;
			};
			img.src = e.target.result;
            setAvatar(img.src)
		};
		Filereader.readAsDataURL(File);
    }
    
    useEffect(() => {
        setOldAvatar(data.avatar)
        setAvatar(data.avatar)
    }, [data])

    useEffect(() => {
        setAvatar(oldAvatar)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])
    const map = 
        <div key="infos" className='flex flex-col space-y-2'>
            {infos.map((element, id) => {
                return (
                    <div key={id} className='w-full p-2 bg-zinc-500  rounded-sm'>
                        <h1 className='text-white text-sm'>{element}</h1>
                    </div>
            )})}
        </div>

    const mapImg = 
        <div className='h-80 w-full bg-zinc-800 flex items-center justify-center py-10 space-x-14 rounded-xl'>
            {imgs.map((element, id) => {
                return (
                    <img key={id} alt="img" src={element} className="border-[3px] border-white rounded-sm  h-56 w-40 "/>
            )})}
        </div>

  return (
    <div className='h-screen w-full flex  justify-center px-2 xs:px-8 sm:px-20 md:px-36 lg:px-48 '>
        <div className='w-full flex flex-col space-y-14 mt-40'>
            <div className='w-full py-6 px-5 xs:px-10 flex flex-col lg:flex-row lg:space-x-5 bg-zinc-800 rounded-xl'>
                <div className='lg:w-[30%] flex flex-col items-center justify-center pt-16 pb-20  relative'>
                    <div className='w-48 h-48 rounded-full bg-white flex justify-center items-end overflow-x-hidden'>
                        {avatar === null ?
                            <FontAwesomeIcon icon={faUser} size="9x" className='text-gray-500'/> :
                            <img alt="avatar" src={avatar} className="w-48 h-48" onClick={() => setShowModal(true)}></img>
                        }
                    </div>
                    <ModalImage image={avatar} showModal={showModal} setShowModal={setShowModal} />
                    <div className={update === 1 ? 'absolute bottom-0 lg:bottom-5 flex justify-center items-center ' : "hidden"}>
                        <Lottie animationData={camera} loop={true} autoPlay={true} style={{cursor: 'pointer', width : '60px'}} onClick={uploadImg}/>
                        <input name="Avatar" className='hidden' id="Avatar" type="file" onChange={(e) => handleUpload(e)}/>
                    </div>
                </div>
                <div className='h-[2px] mt-10 lg:mt-0 lg:h-auto lg:w-[2px] bg-zinc-700 '/>
                <div className='lg:w-full flex flex-col space-y-4 py-16'>
                    <div className='w-full flex justify-end space-x-2'>
                        <FontAwesomeIcon icon={faKey} className="p-2 text-gray-600 border border-gray-600 rounded-sm cursor-pointer" onClick={() => update === 2 ? setUpdate(0) : setUpdate(2)}/>
                        <FontAwesomeIcon icon={faPen} className="p-2 text-gray-600 border border-gray-600 rounded-sm cursor-pointer" onClick={updateInfos}/>
                    </div>
                    {
                        update === 0 ? [map] : update === 1 ?
                        <form className='flex flex-col' onSubmit={changeInfos}>
                            <input name="username" type="text" placeholder='Please Enter Your username' className='input-profile' value={userInfo.username} onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}></input>
                            <h1 className='flex text-xs text-red-600 mb-2'>{errors.username}</h1>
                            <input name="firstName" type="text" placeholder='Please Enter Your firstName' className='input-profile' value={userInfo.firstName} onChange={(e) => setUserInfo({...userInfo, firstName: e.target.value})}></input>
                            <h1 className='flex text-xs text-red-600 mb-2'>{errors.firstName}</h1>
                            <input name="lastName" type="text" placeholder='Please Enter Your lastName' className='input-profile' value={userInfo.lastName} onChange={(e) => setUserInfo({...userInfo, lastName: e.target.value})}></input>
                            <h1 className='flex text-xs text-red-600 mb-2'>{errors.lastName}</h1>
                            <input name="email" type="text" placeholder='Please Enter Your email' className='input-profile' value={userInfo.email} onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}></input>
                            <h1 className='flex text-xs text-red-600 mb-2'>{errors.email}</h1>
                            <button className='rounded-sm' onClick={changeInfos}>{t('Edit change')}</button>
                        </form> :
                        <form className='flex flex-col' onSubmit={changePassword}>
                            <input name="Password" type="text" placeholder='Please Enter Your New email' className='input-profile' value={pass.password} onChange={(e) => setPass({...pass, password: e.target.value})}></input>
                            <h1 className='flex text-xs text-red-600 mb-2'>{errors.password}</h1>
                            <input name="confPassword" type="text" placeholder='Please Confirm Your New email' className='input-profile' value={pass.confPassword} onChange={(e) => setPass({...pass, confPassword: e.target.value})}></input>
                            <h1 className='flex text-xs text-red-600 mb-2'>{errors.confPassword}</h1>
                            <button className='rounded-sm' onClick={changePassword}>{t('Change Password')}</button>
                        </form>
                    }   

                </div>
            </div>
            {mapImg}
        </div>
    </div>
  )
}

export default Profile