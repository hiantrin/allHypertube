import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import instance from './instances/instance'
import swal from 'sweetalert'

const Confirm = () => {
    let { slug } = useParams();
    const navigate = useNavigate();


    useEffect(() => {
        const checkToken = async () => {
            const res = await instance.post('/auth/confirm', {
              token: slug,
			  type: 1,
            });
            if (res.data.status === 0)
			{
				if (res.data.error === "account is already verified")
				{
					swal({
						title: "Oooooooops!!",
						text: "Your email is already verified",
						icon: "warning",
						buttons: "close"
					})
				}
				else {
					swal({
						title: "Nooooooop!!",
						text: "Something get wrong Please Try again",
						icon: "error",
						buttons: "close"
					})
				}
				
				navigate("/signIn")
			}
			else {
				swal({
					title: "Yeeeeeeep",
					text: "You have verified your email",
					icon: "success",
					buttons: "close"
				})
				navigate("/signIn")
			}
        }
        checkToken();
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  return null;
}

export default Confirm