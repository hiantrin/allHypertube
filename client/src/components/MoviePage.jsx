import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'

const MoviePage = () => {
    const [movie, setMovie] = useState({})
    const navigate = useNavigate()
    const { slug } = useParams()
	const [images, setImages] = useState([])
	const [cast, setCast] = useState([])

    const mapImg = 
        <div className='w-auto flex flex-col space-y-4'>
			{images.map((element, id) => {
			return (
					<img alt="background" key={id} src={element} className="border-4 rounded-lg"></img>
				)
			})}
		</div>

	const mapCast = 
		<div className='flex flex-col space-y-8'>
			{cast.map((element, id) => {
				return (
					<div key={id} className='flex items-center space-x-6'>
						{
							element?.url_small_image ? 
							<img alt="Cast" src={element.url_small_image} className="rounded-full w-14 h-14"></img> : 
							<div className='w-14 h-14 rounded-full overflow-x-hidden overflow-y-hidden bg-gray-800 flex justify-center  items-end'><FontAwesomeIcon icon={faUser} className="text-white w-12 h-12"/></div>
						}
						<h1 className='text-white text-sm'>{element.name}</h1>
					</div>
				)
			})}
		</div>

    useEffect(() => {
        const movieDetails = async () => {
            const res = await axios.get(`https://yts.mx/api/v2/movie_details.json?movie_id=${slug}&with_images=true&with_cast=true`)
            if (res.data.status === "ok") {
                setMovie(res.data.data.movie)
				const imgs = [
					res.data.data.movie.medium_screenshot_image1,
					res.data.data.movie.medium_screenshot_image2,
					res.data.data.movie.medium_screenshot_image3
				]
				setImages(imgs)
				const actors = [
					...res.data.data.movie.cast
				]
				setCast(actors)
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
  return (
    <div className='h-screen w-full flex  justify-center px-[10%]'>
        <div className='mt-40 flex flex-col items-center w-full '>
            <div className='flex items-center justify-between w-full'>
                <img alt="cover" className=' border-[2.5px] rounded-lg' src={movie.medium_cover_image}/>
                <div className='flex flex-col items-center justify-center space-y-9'>
                    <h1 className='text-white text-3xl font-bold '>{movie.title}</h1>
                    <h1 className='text-white text-xl'>{movie.year}</h1>
                    { movie?.genres ?
                    	<div className='flex space-x-8'>
                        	{movie.genres.map((element, id) => {
                            	return (
                                    <h1 key={id} className="text-white text-xl">{element}</h1>
                                )
                            })}
                        </div> : ""
                    }
					<div className='flex space-x-32  items-center w-full'>
						<h1 className='text-zinc-300 text-sm '>Quality :</h1>
						<h1 className='text-sm border border-zinc-500 p-1 text-zinc-300'>720HD</h1>
						<h1 className='text-sm border border-zinc-500 p-1 text-zinc-300'>1080HD</h1> 
					</div>
					<div className='flex items-center w-full'>
						<h1 className='text-zinc-300 text-sm mr-32'>Rating :</h1>
						<h1 className='text-zinc-300 text-md mr-3'>{movie.rating}</h1>
						<FontAwesomeIcon icon={faStar} className="text-red-600"/>

					</div>
					<div className='flex items-center w-full'>
						<h1 className='text-zinc-300 text-sm mr-32'>Time :</h1>
						<h1 className='text-zinc-300 text-md '>{movie.runtime}  min</h1>
					</div>
                </div>
				{mapImg}
            </div>
			<button className='mt-10'>Watch now</button>
			<div className='flex justify-between items-center  mt-20'>
				<div className='flex flex-col items-center text-center space-y-10 w-[60%]'>
					<h1 className='text-white text-2xl'>Description</h1>
					<h1 className='text-white text-sm'>{movie.description_full}</h1>
				</div>
				<div className='flex flex-col space-y-10 w-[30%]'>
					<h1 className='text-white text-2xl text-center'>Cast</h1>
					{mapCast}
				</div>
			</div>
			<div className='mt-10 flex items-center justify-center'>
					<h1 className='text-white text-lg'>Thank you for watching</h1>
			</div>
        </div>
    </div>
  )
}

export default MoviePage