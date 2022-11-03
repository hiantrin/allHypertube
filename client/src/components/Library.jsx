import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import MoviesSearch from './MoviesSearch'
import instance from '../components/instances/instance'

const Library = () => {
    const [movie, setMovie] = useState("")
    const [gender, setGender] = useState("All")
    const [rating, setRating] = useState(0)
    const [allMovies, setAllMovies] = useState([])
    const [error, setError] = useState({})
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

    const validate = () => {
        const err = {}
        const regex = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/i
        if (!regex.test(movie)) {
            err.search = "Only numbers, characters and spaces are alowed"
        }
        if (Object.keys(err).length === 0) {
            return false;
        }
        return (err);
    }

    const getIt = async (string) => {
        const res = await instance.get(`/movies/getMovies?string=${string}`)
        console.log(res)
    } 

    const searchMovie = (e) => {
        e.preventDefault()
        const err = validate()
        if (err)
            setError(err)
        else {
            const string = `query_term=${movie}`
            getIt(string)
        }
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
            setAllMovies(res.data.data.movies)
        else if (res.data.status === 'error') {

        }
    }

    const searchBy = () => {
        const sortBy = Object.keys(sort).filter((item) => sort[item] === true)
        sortBy[0] = sortBy[0].toLowerCase()
        const string = `limit=50&sort_by=${sortBy[0]}&genre=${gender === 'All' ? "" : gender}&minimum_rating=${rating}`
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
					<h1 key={id} className="py-2 pl-2 pr-10 xm:pr-20 text-black cursor-pointer hover:bg-zinc-700 text-xs xm:text-lg">{element}+</h1>
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
					<h1 key={id} className="p-2 text-black cursor-pointer hover:bg-zinc-700 text-xs xm:text-lg">{element}</h1>
					<div className='h-[1px] bg-black'/>
				</div>
			)
		})}
	</div>

    const mapSort = 
        <div className=' space-y-4 xm:space-y-0 flex flex-col xm:flex-row xm:space-x-2 mb-20'>
            {sortInfos.map((element, id) => {
                return(
                    <div key={id} className='flex space-x-2 xm:items-center xm:justify-center'>
                        <div className='w-4 h-4 border-2  border-red-600 rounded-full flex items-center justify-center cursor-pointer' onClick={() => clickSort(element)}>
                            <div className={sort[element] ? 'bg-red-600 w-2 h-2 rounded-full' : ""}/>
                        </div>
                        <h1 className='text-white text-sm'>{element}</h1>
                    </div>
                )
            })}
        </div>

  return (
    <div className='h-screen w-full flex  justify-center px-[3%] xs:px-[10%] sm:px-[15%] lg:px-48'>
        <div className='mt-40 flex flex-col items-center w-full'>
            <h1 className='text-white text-xl xs:text-3xl mb-6'>HYPERTUBE</h1>
            <h1 className='text-white text-xs xs:text-sm mb-4'>Welcome to the official  Hypertube Website</h1>
            <form className='bg-zinc-800  flex justify-center items-center px-2 w-full lg:w-[600px]' onSubmit={searchMovie}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='cursor-pointer ' onClick={searchMovie}/>
                <input name="search" type="text" placeholder='Find the best movies' className='input-profile bg-transparent border-none hover:shadow-none w-full ' value={movie} onChange={(e) => setMovie(e.target.value)}/>
            </form>
            <h1 className='text-sm text-red-600 mb-8'>{error.search}</h1>
            <div className='flex justify-between  w-full lg:w-[600px] mb-16'>
                <div className='flex flex-col relative'>
                    <h1 className='text-white text-xs xm:text-sm'>Gender</h1>
                    <div className='flex space-x-8 sm:space-x-20 cursor-pointer' onClick={() => {setShowGender(!showGender) ; setShowRating(false)}}>
                        <h1 className='text-red-600 text-xs xm:text-lg'>{gender}</h1>
                        <FontAwesomeIcon icon={faSortDown} className="text-red-600 text-xs xm:text-lg"/>
                    </div>
					{mapGender}
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-white text-xs xm:text-sm'>Rating</h1>
                    <div className='flex space-x-8 sm:space-x-20 cursor-pointer' onClick={() => {setShowRating(!showRating) ; setShowGender(false)}}>
                        <h1 className='text-red-600 text-xs xm:text-lg'>{rating === 0 ? 'All' : rating}</h1>
                        <FontAwesomeIcon icon={faSortDown} className="text-red-600 text-xs xm:text-lg"/>
                    </div>
					{mapRating}
                </div>
                <button className='text-xs xm:text-lg' onClick={searchBy}>Search</button>
            </div>
            <h1 className='text-white text-sm mb-6 xm:mb-3 '>Sort by</h1>
            {mapSort}
            <MoviesSearch movies={allMovies}/>
        </div>
    </div>
  )
}

export default Library