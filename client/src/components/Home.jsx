import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className='flex items-center justify-center w-full h-screen'>
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-3xl xs:text-5xl font-bold text-white mb-4'>See What's next</h1>
            <h1 className='text-white text-xs xs:text-lg mb-6'>WATCH ANYWHER. CANCEL ANYTIME</h1>
            <button className=' xs:w-80 xs:h-16 animate-bounce text-xs p-4 xs:p-0 xs:text-lg' onClick={() => navigate("/signUp")}>START WATCHING FOR FREE<span className='ml-2'><FontAwesomeIcon icon={faChevronRight} /></span> </button>
        </div>
    </div>
  )
}

export default Home