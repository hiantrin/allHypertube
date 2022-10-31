import React, {useEffect, useRef} from 'react'

const ModalImage = ({image, showModal, setShowModal}) => {
    const ModalRef = useRef(0);
	useEffect(() => {
		const HanleModal = (event) => {
			if (ModalRef.current && !ModalRef.current.contains(event.target)) {
				setShowModal(false)
			  }
		}
		if (showModal)
			document.addEventListener('click',HanleModal,true);
		return () => {
		  document.removeEventListener('click',HanleModal,true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	  }, [showModal])

    return (
        <>
        	{showModal ? (
				<>
            	<div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
					<div ref={ModalRef} className="w-[50%] h-[50%] flex justify-center items-center p-10 bg-transparent gap-10 rounded-xl">
						<img src={image} className="border rounded-xl w-full h-full" alt="al"></img>
					</div>
				</div>
				<div className="opacity-90 fixed inset-0 z-40 bg-black "></div>
				</>
    		) : null}
        </>
    );
}

export default ModalImage