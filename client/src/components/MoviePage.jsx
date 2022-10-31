import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'

const MoviePage = () => {
    const [movie, setMovie] = useState({})
    const navigate = useNavigate()
    const { slug } = useParams()
    useEffect(() => {
        const movieDetails = async () => {
            const res = await axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${slug}&with_images=true&with_cast=true`)
            if (res.data.status === "ok") {
                setMovie(res.data.data.movie)
            }
            else {
                swal({
                    title: "Ooooooooops!!!",
                    text: "This movie is Not Available Please select another one",
                    icon: "warning",
                    buttons: "close"
                })
                navigate("/library")
            }
        }
        movieDetails()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    console.log(movie)
  return (
    <div className='h-screen w-full flex  justify-center px-[10%]'>
        <div className='mt-40 flex flex-col items-center w-full '>
            <div className='flex items-center justify-between w-full'>
                <img alt="cover" className='w-40 h-60 border-[2.5px] rounded-lg' src={movie.medium_cover_image}/>
                <div className='flex flex-col items-center justify-center space-y-6'>
                    <h1 className='text-white text-2xl font-bold '>{movie.title}</h1>
                    <h1 className='text-white '>{movie.year}</h1>
                    { movie?.genres ?
                    	<div className='flex space-x-8'>
                        	{movie.genres.map((element, id) => {
                            	return (
                                    <h1 key={id} className="text-white">{element}</h1>
                                )
                            })}
                        </div> : ""
                    }
					<div className='flex space-x-32  items-center w-full'>
						<h1 className='text-zinc-300 text-xs '>Quality :</h1>
						<h1 className='text-xs border border-zinc-500 p-1 text-zinc-300'>720HD</h1>
						<h1 className='text-xs border border-zinc-500 p-1 text-zinc-300'>1080HD</h1> 
					</div>
					<div className='flex items-center w-full'>
						<h1 className='text-zinc-300 text-xs mr-32'>Rating :</h1>
						<h1 className='text-zinc-300 text-md mr-3'>{movie.rating}</h1>
						<FontAwesomeIcon icon={faStar} className="text-red-600"/>

					</div>
					<div className='flex items-center w-full'>
						<h1 className='text-zinc-300 text-xs mr-32'>Time :</h1>
						<h1 className='text-zinc-300 text-md '>{movie.runtime}  min</h1>
					</div>
                </div>
            </div>
        </div>
        
    </div>
  )
}

export default MoviePage