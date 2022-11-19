import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import swal from 'sweetalert'

const AuthError = () => {
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const showError= () => {
            if(slug.substring(0, 10) === "authToken:")
            {
                const token = slug.substring(10);
                localStorage.setItem('authToken', token);
            }
            else
            {
                swal({
                    title: "Noooooooooop",
                    text : slug,
                    icon : "error",
                    buttons : "close"
                })
            }
            navigate('/signUp')
        }
        showError()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  return 0
}

export default AuthError