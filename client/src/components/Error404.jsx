import React from 'react'
import Lottie from "lottie-react";
import Error from '../images/404.json'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
	const navigate = useNavigate();

	const gohome = () => {
    	navigate("/");
  	}

	return (
		<div className='flex flex-col justify-center items-center mt-40' >
          <Lottie animationData={Error} loop={true} autoPlay={true} style={{width : '60%', height : '60%'}} />
          <button className='w-[20%] h-[40px] flex justify-center items-center rounded-full shadow-xl px-4' onClick={gohome}>
            <h1 className='mr-6 font-bold'>Back To Home</h1>
            <FontAwesomeIcon icon={faArrowRight}  style={{fontSize : '1.4em'}}/>
            </button>
    </div>
	)
}

export default Error404