import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className='flex items-center justify-center w-full h-screen'>
        <div className='flex flex-col items-center justify-center'>
            <h1 className='text-3xl xs:text-5xl font-bold text-white mb-4'>{t("See what's next")}</h1>
            <h1 className='text-white text-xs xs:text-lg mb-6'>{t('Watch anywhere. Cancel Anytime')}</h1>
            <button className=' xs:w-80 xs:h-16 animate-bounce text-xs p-4 xs:p-0 xs:text-lg' onClick={() => navigate("/signUp")}>{t('Start Watching For Free')}<span className='ml-2'><FontAwesomeIcon icon={faChevronRight} /></span> </button>
        </div>
    </div>
  )
}

export default Home