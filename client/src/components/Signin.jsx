import React, { useState } from 'react'
import GoogleImg from "../images/google.png"
import GithubImg from "../images/github.png"
import IntraImg from "../images/42.png"
import { useNavigate } from 'react-router-dom'
import instance from './instances/instance'
import swal from 'sweetalert'


const Signin = () => {
	const navigate = useNavigate();
  	const butts = [
		{title: "Google", icon: GoogleImg, path: "", color:"bg-red-800", size: "w-5 h-5"},
		{title: "Github", icon: GithubImg, path: "", color:"bg-white text-black", size: "w-7 h-7"},
		{title: "IntraImg", icon: IntraImg, path: "", color:"bg-cyan-500", size: "w-8 h-8"}
  	]
	const [infos, setInfos] = useState({email: "", password: ""});
	const [errors, setErrors] = useState({})

	const prevent = (e) => {
		e.preventDefault();
		submitInfos();
	}

	const validate = () => {
		const errors= {};
		const regex = /^([a-zA-Z._0-9-]+)@([a-zA-Z0-9]+[.]?)*([a-zA-Z0-9])(\.[a-zA-Z]{2,4})$/i;
		const passregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\\[\]|\\:;"'<>,.?/_₹])/i;
		const lenghtregex = /^.{7,20}$/i;
		if (!infos.email) {
			errors.email = "email name is required!"
		} else if (!regex.test(infos.email) ) {
			errors.email = "This is not a valid email format!"
		}
		if (!infos.password) {
			errors.password = "password  is required!"
		}else if (!passregex.test(infos.password)) {
			errors.password = "password must contain special character numbers lowercase and Uppercase"
		} else if (!lenghtregex.test(infos.password))
		{
			errors.password = "password must be 7-16 characters long."
		}
		if (Object.keys(errors).length === 0) {
			return false;
		}
		return errors;
	}

	const authBack = async () => {
		const res = await instance.post('/signIn', {
			...infos,
		})
		if (res.data.status === 0){
			if (res.data.error === "Something went wrong") {
				swal({
					title: "Oooooooops",
					text: `${res.data.error} Please Try Again Later`,
					icon: "warning",
					buttons: "close"
				})
			}
			else if (res.data.error  === "Please verify your email first") {
				swal({
					title: "Oooooooops",
					text: res.data.error,
					icon: "error",
					buttons: "close"
				})
			}
			else
				setErrors(res.data.error);
		}
		else{ 
			localStorage.setItem('authToken', res.data.data.token);
			navigate("/user/profile")
		}
	}

	const submitInfos = async (e) => {
		e.preventDefault();
		const err = validate();
		if (err){
			setErrors(err)
		}else {
			setErrors({})
			await authBack()
		}
	}

	const map = 
		<div className='flex flex-col space-y-2 mb-5 w-full xs:w-96'>
			{butts.map((item, id) => {
				return(
					<button key={id} className={`w-full h-10 + ${item.color} `}>Sign in with {item.title} <img alt="google" src={item.icon} className={`ml-3 + ${item.size}`}></img> </button>
			)})}
		</div>

	return (
		<div className='h-screen w-full flex items-center justify-center sm:justify-end sm:pr-[20%]'>
			<div className='flex flex-col w-[250px] xs:w-auto'>
				<div className='flex justify-end mb-8'>
					<h1 className='text-5xl font-bold text-white'>Sign in</h1>
				</div>
				{map}
				<div className='flex w-auto  items-center justify-between mb-5'>
					<div className='w-[44%] h-[2px] bg-white rounded-full'></div>
					<h1 className='text-white text-lg'>Or</h1>
					<div className='w-[44%] h-[2px] bg-white rounded-full'></div>
				</div>
				<form className='w-auto  mb-1' onSubmit={prevent}>
					<input name="email" placeholder='Email' className='input-gray' value={infos.email} onChange={(e) => setInfos({...infos, email: e.target.value})}></input>
					<h1 className='flex text-xs text-red-600 mb-2'>{errors.email}</h1>
					<input name="password" placeholder='Password' className='input-gray' value={infos.password} onChange={(e) => setInfos({...infos, password: e.target.value})}></input>
					<h1 className='flex text-xs text-red-600 mb-2'>{errors.password}</h1>
					<button className='w-full h-10 rounded-sm' onClick={submitInfos}>Sign in</button>
				</form>
				<div className='w-auto flex justify-end mb-5'>
					<h1 className='text-gray-400 text-sm italic cursor-pointer translate-h' onClick={() => navigate("/auth/forgetPassword")}>Forget password ?</h1>
				</div>
				<div className='flex space-x-2'>
					<h1 className='text-gray-500 text-sm'>New to Hypertube ? </h1> 
					<h1 className='text-gray-300 text-sm cursor-pointer italic translate-h' onClick={() => navigate("/signUp")}> Sign Up Now.</h1>
				</div>
			</div>
		</div>
	)
}

export default Signin