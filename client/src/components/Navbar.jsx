import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import Flag from 'react-flagkit';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUserLog, getUserLog } from './redux/reducers/userLog';


const Navbar = () => {
	const navigate = useNavigate();
	const auth = useSelector(getUserLog)
	const dispatch = useDispatch()
	const {pathname} = useLocation()
	const [navbarColor, setNavbarColor] = useState("")
	const [show, setShow] = useState(false)
	const [lang, setLang] = useState("US")

	const arr = [
		"US",
		"FR",
		"SA"
	]

	const logOut = () => {
		localStorage.removeItem('authToken')
		dispatch(addUserLog(false));
		navigate("/signIn")
	}

	useEffect(() => {
		if (pathname === "/user/profile" || pathname === "/library" || pathname.slice(0, 6) === "/movie") 
		{
			setNavbarColor("bg-black")
		}
		else {
			setNavbarColor("bg-transparent")
		}
	}, [pathname])

	const mapLanguage = 
		<div className='absolute bg-black right-28 top-16 p-2 space-y-2'>
			{arr.map((element, id) => {
				return(
					<div className='flex flex-col space-y-2'>
						<div kay={id} className={"flex items-center justify-center space-x-5 cursor-pointer text-white hover:text-red-600"} onClick={() => {setLang(element) ; setShow(false)}}>
							<h1 className=''>{element === "US" ? "English" : element === "FR" ? "Frensh" : "Arabic"}</h1>
							<Flag country={element} className="w-8"/>
						</div>
						<div className={element !== 'SA' ? "flex w-full h-[1px] bg-red-600 " : "hidden"}></div>
					</div>
				)})
			}
		</div>

	return (
    	<div  className={`w-full h-16  flex justify-between items-center p-2 xs:p-6 ${navbarColor} fixed z-10 `}>
			<div className='space-x-1 flex items-center justify-center cursor-pointer' onClick={(() => auth === false ? navigate("/") : navigate("/library"))}>
				<FontAwesomeIcon icon={faPlay} className="text-sm xs:text-2xl text-white p-2 bg-red-600 rounded-full"/>
				<h1 className='text-white text-sm xs:text-lg hidden xm:flex'>Hypertube</h1>
			</div>
			<div className='flex space-x-1 xm:space-x-3'>
				<Flag country={lang} onClick={() => setShow(!show)} className="cursor-pointer"/>
				{
					auth === false ?
					<button className='p-2 xs:px-4 xs:py-2 text-sm xs:text-lg' onClick={() => navigate('/signIn')}>Sign in</button> : 
					<>
						<button className='text-xs xm:text-[16px] bg-transparent hover:bg-transparent hover:border hover:border-red-600' onClick={() => navigate("/user/profile")}>Profile</button>
						<button className='text-xs xm:text-[16px]' onClick={logOut}>Log out</button>
					</>
				}
			</div>
			{show ? mapLanguage : ""}
    	</div>
	)
}

export default Navbar