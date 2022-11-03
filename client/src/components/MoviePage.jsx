import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import Oops from '../images/notFound.jpeg'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'


const MoviePage = () => {
    const [movie, setMovie] = useState({})
    const navigate = useNavigate()
    const { slug } = useParams()
	const [images, setImages] = useState([])
	const [cast, setCast] = useState([])
	const [showImage, setShowImage] = useState(true)

    const mapImg =
        <div className='w-auto flex flex-wrap justify-center gap-10 xl:gap-0 xl:flex-col xl:space-y-4 md:absolute xl:static top-[450px] xl:top-0 '>
			{images.map((element, id) => {
			return (
					<img alt="background" key={id} src={element} className="border-4 rounded-lg"></img>
				)
			})}
		</div>

	const mapCast =
		<div className='flex gap-8 flex-wrap '>
			{cast.length === 0 ? 
				<div className='flex space-x-5 items-center '> 
					<FontAwesomeIcon icon={faCircleExclamation} className="text-yellow-500 text-2xl"/>
					<h1 className='text-white text-lg'>Actors Details not available</h1>
				</div> : "" 
			}
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
				if (res.data.data.movie?.cast)
				{
					const actors = [
						...res.data.data.movie.cast
					]
					setCast(actors)
				}
				
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
    <div className='h-auto w-full flex  justify-center px-[10%]'>
        <div className='mt-40 flex flex-col items-center w-full '>
            <div className='flex flex-col md:flex-row items-center  xl:justify-between w-full relative space-y-20 md:space-y-0'>
                <img alt="cover" className={showImage ? ' border-[2.5px] rounded-lg' : "hidden"} src={movie.medium_cover_image} onError={() => setShowImage(false) }/>
				<div className={showImage ? "hidden" : 'flex justify-center items-center w-56 '} >
					<img alt="OOOps" src={Oops} className="w-full h-full"></img>
				</div>
                <div className='flex flex-col items-center justify-center space-y-9 md:ml-20 lg:ml-56 xl:ml-0'>
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
					<div className='flex space-x-5 xm:space-x-16 lg:space-x-32  items-center w-full'>
						<h1 className='text-zinc-300 text-sm '>Quality :</h1>
						<h1 className='text-sm border border-zinc-500 p-1 text-zinc-300'>720HD</h1>
						<h1 className='text-sm border border-zinc-500 p-1 text-zinc-300'>1080HD</h1> 
					</div>
					<div className='flex items-center w-full'>
						<h1 className='text-zinc-300 text-sm mr-6 xm:mr-[70px] lg:mr-[134px]'>Rating :</h1>
						<h1 className='text-zinc-300 text-md mr-3'>{movie.rating}</h1>
						<FontAwesomeIcon icon={faStar} className="text-red-600"/>

					</div>
					<div className='flex items-center w-full'>
						<h1 className='text-zinc-300 text-sm mr-8 xm:mr-[80px] lg:mr-[140px]'>Time :</h1>
						<h1 className='text-zinc-300 text-md '>{movie.runtime}  min</h1>
					</div>
                </div>
				{mapImg}
            </div>
			<button className='mt-24 md:mt-[700px] xl:mt-24'>Watch now</button>
			<div className='flex flex-col justify-center items-center  mt-20 w-full space-y-20'>
				<div className='flex flex-col space-y-10 justify-center items-center'>
					<h1 className='text-white text-2xl text-center'>Cast</h1>
					{mapCast}
				</div>
				<div className='flex flex-col items-center text-center space-y-10 max-w-[600px]'>
					<h1 className='text-white text-2xl font-bold'>Description</h1>
					<h1 className='text-gray-300 text-lg'>{movie.description_full}</h1>
				</div>
			</div>
			<div className='mt-20 flex items-center justify-center'>
					<h1 className='text-white text-lg'>Thank you for watching</h1>
			</div>
			<div className='mt-20'>

			</div>
        </div>
    </div>
  )
}

export default MoviePage