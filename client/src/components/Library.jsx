import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import MoviesSearch from './MoviesSearch'

const Library = () => {
    const [movie, setMovie] = useState("")
    const [gender, setGender] = useState("All")
    const [rating, setRating] = useState(0)
    const [allMovies, setAllMovies] = useState([])
    const [sort, setSort] = useState({
        Title: false,
        Rating: false,
        Gender: false,
        Year: false,
        Popular: false
    })
    const sortInfos = [
        "Title",
        "Rating",
        "Gender",
        "Year",
        "Popular"
    ]
    const allGender = [
        "All",
		"Action",
		"Adventure",
		"Comedy",
		"Documentary",
		"Drama",
		"History",
		"Fantasy",
		"Musical",
		"Romance",
		"Animation",
		"Crime",
		"Film-Noir",
		"Music",
		"Sport",
		"War",
		"Talk-Show",
		"Mystery"
    ]
	const allRating = [
        0,
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9
	]
	const [showGender, setShowGender] = useState(false)
	const [showRating, setShowRating] = useState(false)

    const searchMovie = (e) => {
        e.preventDefault()
        console.log(movie)
    }

    const clickSort = (element) => {
        const myWe = {
            Title: false,
            Rating: false,
            Gender: false,
            Year: false,
            Popular: false
        }
        myWe[element] = !sort[element]
        setSort(myWe)
    }

    const getMovies = async (string) => {
        const res = await axios.get(`https://yts.mx/api/v2/list_movies.json?${string}`)
        if (res.data.status === 'ok')
        {
            setAllMovies(res.data.data.movies)
        } else if (res.data.status === 'error') {

        }
    }

    const searchBy = () => {
        const string = `limit=50&genre=${gender}&minimum_rating=${rating}`
        getMovies(string)
    }

    useEffect(() => {
        const string = 'limit=50'
        getMovies(string)
    }, [])
	const mapRating = 
	<div className={showRating ? 'flex flex-col bg-zinc-500 absolute mt-14 z-30' : "hidden"}>
		{allRating.map((element, id) => { 
			return (
				<div key={id} onClick={() => { setRating(element); setShowRating(!showRating)}}>
					<h1 key={id} className="py-2 pl-2 pr-20 text-black cursor-pointer hover:bg-zinc-700 ">{element}+</h1>
					<div className='h-[1px] bg-black'/>
				</div>
			)
		})}
	</div>

	const mapGender = 
	<div className={showGender ? 'flex flex-col bg-zinc-500 absolute mt-14 z-30' : "hidden"}>
		{allGender.map((element, id) => { 
			return (
				<div key={id} onClick={() => { setGender(element); setShowGender(!showGender)}}>
					<h1 key={id} className="p-2 text-black cursor-pointer hover:bg-zinc-700 ">{element}</h1>
					<div className='h-[1px] bg-black'/>
				</div>
			)
		})}
	</div>

    const mapSort = 
        <div className='flex space-x-2 mb-20'>
            {sortInfos.map((element, id) => {
                return(
                    <div key={id} className='flex space-x-2 items-center justify-center'>
                        <div className='w-4 h-4 border-2  border-red-600 rounded-full flex items-center justify-center cursor-pointer' onClick={() => clickSort(element)}>
                            <div className={sort[element] ? 'bg-red-600 w-2 h-2 rounded-full' : ""}/>
                        </div>
                        <h1 className='text-white text-sm'>{element}</h1>
                    </div>
                )
            })}
        </div>

  return (
    <div className='h-screen w-full flex  justify-center px-48'>
        <div className='mt-40 flex flex-col items-center w-full'>
            <h1 className='text-white text-3xl mb-6'>HYPERTUBE</h1>
            <h1 className='text-white text-sm mb-4'>Welcome to the official  Hypertube Website</h1>
            <form className='bg-zinc-800  flex justify-center items-center px-2 mb-6' onSubmit={searchMovie}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='cursor-pointer ' onClick={searchMovie}/>
                <input name="search" type="text" placeholder='Find the best movies' className='input-profile bg-transparent border-none hover:shadow-none w-[600px]' value={movie} onChange={(e) => setMovie(e.target.value)}/>
            </form>
            <div className='w-full flex justify-between mb-16 '>
                <div className='flex flex-col relative'>
                    <h1 className='text-white text-sm'>Gender</h1>
                    <div className='flex space-x-20 cursor-pointer' onClick={() => setShowGender(!showGender)}>
                        <h1 className='text-red-600'>{gender}</h1>
                        <FontAwesomeIcon icon={faSortDown} className="text-red-600"/>
                    </div>
					{mapGender}
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-white text-sm'>Rating</h1>
                    <div className='flex space-x-20 cursor-pointer' onClick={() => setShowRating(!showRating)}>
                        <h1 className='text-red-600'>{rating === 0 ? 'All' : rating}</h1>
                        <FontAwesomeIcon icon={faSortDown} className="text-red-600"/>
                    </div>
					{mapRating}
                </div>
                <button onClick={searchBy}>Search</button>
            </div>
            <h1 className='text-white text-sm mb-3'>Sort by</h1>
            {mapSort}
            <MoviesSearch movies={allMovies}/>
        </div>
    </div>
  )
}

export default Library