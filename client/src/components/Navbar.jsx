import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay } from '@fortawesome/free-solid-svg-icons'
import Flag from 'react-flagkit';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUserLog, getUserLog } from './redux/reducers/userLog';


const Navbar = () => {
	const navigate = useNavigate();
	const auth = useSelector(getUserLog)
	const dispatch = useDispatch()

	const logOut = () => {
		localStorage.removeItem('authToken')
		dispatch(addUserLog(false));
		navigate("/signIn")
	}
	return (
    	<div className='w-full h-16  flex justify-between items-center p-2 xs:p-6 bg-transparent fixed z-10'>
			<div className='space-x-1 flex items-center justify-center cursor-pointer' onClick={(() => auth === false ? navigate("/") : navigate("/library"))}>
				<FontAwesomeIcon icon={faPlay} className="text-sm xs:text-2xl text-white p-2 bg-red-600 rounded-full"/>
				<h1 className='text-white text-sm xs:text-lg'>Hypertube</h1>
			</div>
			<div className='flex space-x-3'>
				<Flag country="US" />
				{
					auth === false ?
					<button className='p-2 xs:px-4 xs:py-2 text-sm xs:text-lg' onClick={() => navigate('/signIn')}>Sign in</button> : 
					<>
						<button className='bg-transparent hover:bg-transparent hover:border hover:border-red-600' onClick={() => navigate("/user/profile")}>Profile</button>
						<button onClick={logOut}>Log out</button>
					</>
					
				}
			</div>
    	</div>
	)
}

export default Navbar