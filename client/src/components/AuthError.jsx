import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'

const AuthError = () => {
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const showError= () => {
            const error = {}
            if (slug === "email Already exists")
                error.error = `${slug} please select another email`
            else
                error.error = slug;
            swal({
                title: "Noooooooooop",
                text : error.error,
                icon : "error",
                buttons : "close"
            })
            navigate('/signUp')
        }
        showError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  return 0
}

export default AuthError