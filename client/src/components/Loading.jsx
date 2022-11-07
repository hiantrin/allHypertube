import React from 'react'
import Lottie from "lottie-react";
import loading from '../images/loading.json'

const Loading = ({isLoading}) => {
  return (
    <div className={isLoading ? 'w-screen h-screen flex items-center justify-center bg-black' : "hidden"}>
        <Lottie animationData={loading} loop={true} autoPlay={true} className="w-96"/>
    </div>
  )
}

export default Loading