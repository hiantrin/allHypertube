import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import Oops from '../images/oops.json'
import Lottie from "lottie-react";


const MoviesSearch = ({ movies }) => {
	const [showDetails, setShowDetails] = useState(0)
	const navigate = useNavigate()
	const [myMovies, setMyMovies] = useState([])
	useEffect(() => {
		setMyMovies(movies);
	}, [movies])

    return (
    	<div className='w-full flex flex-wrap  gap-5 justify-center'>
        	{myMovies.map((element, id) => {
            	return(
					<div key={id} className="relative w-56 h-72 border-[2.5px] border-white rounded-lg overflow-x-hidden cursor-pointer overflow-y-hidden" onMouseEnter={() => setShowDetails(element.id)} onMouseLeave={() => setShowDetails(0)}>
						<img alt="cover" className='w-full h-full' src={element.medium_cover_image} onError={(e) => e.target.className = "hidden" }/>
						<div className='w-full h-full flex justify-center items-center'>
							<Lottie animationData={Oops} loop={true} autoPlay={true} />
						</div>
						<div className={showDetails === element.id ?' absolute w-full h-full top-0 flex flex-col items-center justify-center text-center p-4 bg-rgba  space-y-2 ' : "hidden"}>
							 <FontAwesomeIcon icon={faStar} className="text-red-600"/>
							<h1 className='text-white text-md'>{element.rating} / 10 </h1>
							<h1 className='text-white text-md w-full text-ellipsis overflow-hidden '>
								{element?.genres ? element.genres.map((element, id) => {return (`${element},`)}) : ""}
							</h1>
							<button className='text-md p-2 rounded-sm' onClick={() => navigate(`/movie/${element.id}`)}>View Details</button>
							<h1 className='text-white text-md truncate break-words max-w-[90%]'>{element.title}</h1>
							<h1 className='text-white text-md'>{element.year}</h1>
						</div>
					</div>
            	)
          	})}
      </div>
    )
}

export default MoviesSearch