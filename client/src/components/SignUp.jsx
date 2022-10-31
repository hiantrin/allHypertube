import React, { useState } from 'react'
import GoogleImg from "../images/google.png"
import GithubImg from "../images/github.png"
import IntraImg from "../images/42.png"
import { useNavigate } from 'react-router-dom'
import instance from './instances/instance'
import swal from 'sweetalert'

const SignUp = () => {
	const navigate = useNavigate();
	const butts = [
		{icon: GoogleImg, path: "", color:"bg-red-800", size: "w-5 h-5"},
		{icon: GithubImg, path: "", color:"bg-white", size: "w-7 h-7"},
		{icon: IntraImg, path: "", color:"bg-cyan-500", size: "w-8 h-8"}
	  ]
	  const initialValue = {
		firstName: "",
		lastName: "",
		username: "",
		email: "",
		password: "",
		verifyPassword: ""
	  }
	  const [infos, setInfos] = useState(initialValue);
	  const [error, setError] = useState({})

	  const prevent = (e) => {
		e.preventDefault();
		const err = validate();
		if (err)
			setError(err);
		else
		{
			setError({})
			send_to_back()
		}
	  }
	const send_to_back = async () => {
		const res = await instance.post("/signUp", infos);
		console.log(res);
		if (res.data.status === 0  && res.data.error === null)
		{
			swal({
				title : "Oooops!!",
				text: "an error required Please refresh the page",
				icon: "error",
				buttons: "close"
			})
		}
		else if (res.data.status === 0)
			setError(res.data.error)
		else {
			swal({
				title : "Cool", 
				text : "Please check your e-mail to verify your account",
				icon: "success",
				button : "close",
			});
			navigate("/Signin")
		}
	}

	  const validate = () => {
		const errors= {};
        const regex = /^([a-zA-Z._0-9-]+)@([a-zA-Z0-9]+[.]?)*([a-zA-Z0-9])(\.[a-zA-Z]{2,4})$/i;
		const passregex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[~`!@#$%^&*()--+={}\\[\]|\\:;"'<>,.?/_₹])/i;
		const lenghtregex = /^.{7,20}$/i;
		if (!infos.firstName) {
            errors.firstName = "First name is required !"
        } else if (Object.keys(infos.firstName).length < 3 ) {
            errors.firstName = "your first name must contain at least 3 characters"
        }
        if (!infos.lastName) {
            errors.lastName = "last name is required!"
        } else if (Object.keys(infos.lastName).length < 3 ) {
            errors.lastName = "your last name must contain at least 3 characters"
        }
        if (!infos.username) {
            errors.username = "Username is required!";
        } else if (Object.keys(infos.username).length < 3 ) {
            errors.username = "your username must contain at least 3 characters"
        }
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
		if (!infos.verifyPassword){
			errors.verifyPassword = "Please Reenter your password"
		} else if (infos.verifyPassword !== infos.password) {
			errors.verifyPassword = "doesnt match with your password"
		}
        if (Object.keys(errors).length === 0) {
            return false;
        }
        return errors;
	  }

	const map = 
		<div className='flex  space-x-2 mb-5 w-60 xs:w-96'>
			{butts.map((item, id) => {
				return(
					<button key={id} className={`w-[33%] h-10 rounded-lg + ${item.color} `}><img alt="google" src={item.icon} className={`${item.size}`}></img> </button>
			)})}
		</div>
	return (
		<div className='h-screen w-full flex items-center justify-center sm:justify-end sm:pr-[20%] mt-10 xs:mt-0'>
			<div className='flex flex-col'>
				<div className='flex justify-end mb-8'>
					<h1 className='text-3xl xs:text-5xl font-bold text-white'>Sign Up</h1>
				</div>
				{map}
				<div className='flex w-auto  items-center justify-between mb-5'>
					<div className='w-[44%] h-[2px] bg-white rounded-full'></div>
					<h1 className='text-white text-lg'>Or</h1>
					<div className='w-[44%] h-[2px] bg-white rounded-full'></div>
				</div>
				<form className='w-auto space-y-2 mb-8' onSubmit={prevent}>
					<div className='w-full flex flex-col xs:flex-row xs:justify-between space-y-2 xs:space-y-0'>
						<div className='xs:w-[48%]'>
							<input type="text" name="First Name" placeholder='First Name' className='input-gray ' value={infos.firstName} onChange={(e) => setInfos({...infos, firstName : e.target.value})}/>
							<h1 className='flex text-xs text-red-600'>{error.firstName}</h1>
						</div>
						<div className='xs:w-[48%]'>
							<input type="text" name="Last Name" placeholder='Last Name' className='input-gray ' value={infos.lastName} onChange={(e) => setInfos({...infos, lastName : e.target.value})}/>
							<h1 className='flex text-xs text-red-600'>{error.lastName}</h1>
						</div>
					</div>
					<div className='w-full flex flex-col xs:flex-row xs:justify-between space-y-2 xs:space-y-0'>
						<div className='xs:w-[48%]'>
							<input type="text" name="Username" placeholder='Username' className='input-gray ' value={infos.username} onChange={(e) => setInfos({...infos, username : e.target.value})}/>
							<h1 className='flex text-xs text-red-600'>{error.username}</h1>
						</div>
						<div className='xs:w-[48%]'>
							<input type="text" name="Email" placeholder='Email' className='input-gray ' value={infos.email} onChange={(e) => setInfos({...infos, email : e.target.value})}/>
							<h1 className='flex text-xs text-red-600'>{error.email}</h1>
						</div>
					</div>
					<input type="password" name="Password" placeholder='Password' className='input-gray' value={infos.password} onChange={(e) => setInfos({...infos, password : e.target.value})}/>
					<h1 className='flex text-xs text-red-600'>{error.password}</h1>
					<input type="password" name="Verify Password" placeholder='Verify Password' className='input-gray ' value={infos.verifyPassword} onChange={(e) => setInfos({...infos, verifyPassword : e.target.value})}/>
					<h1 className='flex text-xs text-red-600'>{error.verifyPassword}</h1>
					<button className='w-full h-10 rounded-sm' onClick={prevent}>Sign Up</button>
				</form>
				<div className='flex space-x-2'>
					<h1 className='text-gray-500 text-sm'>Already a member ? </h1> 
					<h1 className='text-gray-300 text-sm cursor-pointer italic translate-h' onClick={() => navigate("/signIn")}> Sign In Now.</h1>
				</div>
			</div>
		</div>
  )
}

export default SignUp