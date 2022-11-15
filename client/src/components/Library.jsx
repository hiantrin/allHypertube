import React, { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react'
import { faSortDown } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import MoviesSearch from './MoviesSearch'
import instance from '../components/instances/instance'
import Lottie from "lottie-react";
import movieLoading from "../images/movieLoading.json"
import { useTranslation } from 'react-i18next'

const Library = () => {
    const authToken = localStorage.getItem('authToken')
    const [movie, setMovie] = useState("")
    const [gender, setGender] = useState("All")
    const [rating, setRating] = useState(0)
    const [allMovies, setAllMovies] = useState([])
    const [error, setError] = useState({})
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const { t } = useTranslation();
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
        if (movie.trim().length === 0) {
            err.search = "the Search must not contains only spaces"
            return err;
        }
        if (!regex.test(movie)) {
            err.search = "Only numbers, characters and spaces are alowed"
        }
        if (Object.keys(err).length === 0) {
            return false;
        }
        return (err);
    }

    const getIt = async (string) => {
        const res = await instance.post(`/movies/getMovies`, {
            string: string,
            token: authToken,
            type : 0,
        })
        if(res.data.status === 1)
        {
            if (res.data.data.movies)
            {
                if(res.data.data.movie_count === 0)
                    setAllMovies([])
                else if (res.data.data.movie_count !== 0 && page === 1)
                    setAllMovies(res.data.data.movies)
                else if (res.data.data.movie_count !== 0 && page !== 1)
                    setAllMovies([...allMovies, ...res.data.data.movies])
            }
            else
                setIsLoading(false)
        } else {

        }

    } 

    const searchMovie = (e) => {
        e.preventDefault()
        setPage(1);
        const err = validate()
        if (err)
            setError(err)
        else {
            setError({})
            const string = `limit=50&page=${page}&query_term=${movie}`
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

    const getMovies = async (string, count) => {
        const res = await axios.get(`https://yts.mx/api/v2/list_movies.json?${string}`)
        if (res.data.status === 'ok')
        {
            if (res.data.data?.movies)
            {
                if (count === 1)
                    setAllMovies(res.data.data.movies)
                else
                    setAllMovies([...allMovies, ...res.data.data.movies])
            }
            else
                setIsLoading(false);
        }
        else if (res.data.status === 'error') {

        }
    }

    const searchBy = (count) => {
        if (movie !== "")
        {
            setIsLoading(true);
            setMovie("");
            setPage(1);
        }
        if (count === 1)
            setPage(1)
        const sortBy = Object.keys(sort).filter((item) => sort[item] === true)
        if (sortBy.length !== 0)
            sortBy[0] = sortBy[0].toLowerCase()
        else
            sortBy[0] = "date_added"
        const string = `limit=50&page=${page}&sort_by=${sortBy[0]}&genre=${gender === 'All' ? "" : gender}&minimum_rating=${rating}`
        getMovies(string, page)
    }

    useEffect(() => {
        if (isLoading === true && movie === "")
            searchBy(page)
        if (movie !== "")
            getIt(`limit=50&page=${page}&query_term=${movie}`)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page])

    useEffect(() => {
        window.addEventListener('scroll', () => {
            if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight)
                setPage(page + 1);
        })
    })

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
					<h1 key={id} className="p-2 text-black cursor-pointer hover:bg-zinc-700 text-xs xm:text-lg">{t(element)}</h1>
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
                        <h1 className='text-white text-sm'>{t(element)}</h1>
                    </div>
                )
            })}
        </div>

  return (
    <div className='h-screen w-full flex  justify-center px-[3%] xs:px-[10%] sm:px-[15%] lg:px-48'>
        <div className='mt-40 flex flex-col items-center w-full '>
            <h1 className='text-white text-xl xs:text-3xl mb-6'>HYPERTUBE</h1>
            <h1 className='text-white text-xs xs:text-sm mb-4'>{t('Welcome to the official Hypertube Website')}</h1>
            <form className='bg-zinc-800  flex justify-center items-center px-2 w-full lg:w-[600px]' onSubmit={searchMovie}>
                <FontAwesomeIcon icon={faMagnifyingGlass} className='cursor-pointer ' onClick={searchMovie}/>
                <input name="search" type="text" placeholder={t('Find the best movies')} className='input-profile bg-transparent border-none hover:shadow-none w-full ' value={movie} onChange={(e) => setMovie(e.target.value)}/>
            </form>
            <h1 className='text-sm text-red-600 mb-8'>{error.search}</h1>
            <div className='flex justify-between  w-full lg:w-[600px] mb-16'>
                <div className='flex flex-col relative'>
                    <h1 className='text-white text-xs xm:text-sm'>{t('Gender')}</h1>
                    <div className='flex space-x-8 sm:space-x-20 cursor-pointer' onClick={() => {setShowGender(!showGender) ; setShowRating(false)}}>
                        <h1 className='text-red-600 text-xs xm:text-lg'>{t(gender)}</h1>
                        <FontAwesomeIcon icon={faSortDown} className="text-red-600 text-xs xm:text-lg"/>
                    </div>
					{mapGender}
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-white text-xs xm:text-sm'>{t('Rating')}</h1>
                    <div className='flex space-x-8 sm:space-x-20 cursor-pointer' onClick={() => {setShowRating(!showRating) ; setShowGender(false)}}>
                        <h1 className='text-red-600 text-xs xm:text-lg'>{rating === 0 ? t('All') : rating}</h1>
                        <FontAwesomeIcon icon={faSortDown} className="text-red-600 text-xs xm:text-lg"/>
                    </div>
					{mapRating}
                </div>
                <button className='text-xs xm:text-lg' onClick={() => searchBy(1)}>{t('Search')}</button>
            </div>
            <h1 className='text-white text-sm mb-6 xm:mb-3 '>{t('Sortby')}</h1>
            {mapSort}
            <MoviesSearch movies={allMovies}/>
            <Lottie animationData={movieLoading} loop={true} autoPlay={true}  className={!isLoading ? "hidden " : "flex"}/>
        </div>
    </div>
  )
}

export default Library