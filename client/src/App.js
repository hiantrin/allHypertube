import Navbar from "./components/Navbar";
import Home from "./components/Home";
import { Routes, Route, useNavigate } from "react-router-dom"
import Signin from "./components/Signin";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import SignUp from "./components/SignUp";
import Confirm from "./components/Confirm";
import ForgetPassword from "./components/ForgetPassword";
import ResetPassword from "./components/ResetPassword";
import Profile from "./components/Profile";
import checkAuth from "./components/Auth";
import PrivateRoutes from "./components/privateRoutes/PrivateRoutes";
import PublicRoutes from "./components/publicRoutes/PublicRoutes";
import instance from "./components/instances/instance";
import swal from "sweetalert";
import { useDispatch} from "react-redux";
import { addUserData} from "./components/redux/reducers/userSlice";
import { addUserLog } from "./components/redux/reducers/userLog";
import Library from "./components/Library";
import MoviePage from "./components/MoviePage";

function App() {
	const location = useLocation();
	const [auth, setAuth] = useState(null);
	const token = localStorage.getItem('authToken')
    const dispatch = useDispatch()
	const navigate = useNavigate()
	const slug = localStorage.getItem('resetToken')


	useEffect(() => {
		const check = async () => {
			const res = await checkAuth()
			if (res === true)
			{
				const res = await instance.post('/user/getInfos', {
					token: token,
					type: 0
				})
				if (res.data.status === 0) {
					swal({
						title: "Oooooooops",
						text: "Something gone Wrong Please Log In Again",
						icon: "Error",
						buttons: "close"
					})
                    localStorage.removeItem('authToken')
					navigate("/signIn")
                } else {
                    dispatch(addUserData(res.data.data))
                    dispatch(addUserLog(true))
                }
			}
			setAuth(res);
		}
		check();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location])

	useEffect(() => {
		if (location.pathname === "/")
		{
			document.body.removeAttribute('class');
			document.body.classList.add('bg-home');
		}
		else if(location.pathname === "/signIn" || location.pathname === "/signUp" || location.pathname === "/auth/forgetPassword" || location.pathname === `/auth/resetPassword/${slug}`)
		{
			document.body.removeAttribute('class');
			document.body.classList.add('bg-signin');
		}
		else {
			document.body.removeAttribute('class');
			document.body.style.backgroundColor = 'black';
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location])

	return (
		<div className="flex flex-col">
			<Navbar />
				<Routes>
					<Route path="/" element={<PublicRoutes auth={auth} />}>
						<Route path='/' element={<Home />}/>
						<Route path='/signIn' element={<Signin />} />
						<Route path='/signUp' element={<SignUp />} />
						<Route path='/auth/forgetPassword' element={<ForgetPassword />} />
						<Route path='/confirm/:slug' element={<Confirm />} />
						<Route path='/auth/resetPassword/:slug' element={<ResetPassword />} />
					</Route>
					<Route path="/" element={<PrivateRoutes auth={auth} />}>
						<Route path='/user/profile' element={<Profile />} />
						<Route path='/library' element={<Library />} />
						<Route path='/movie/:slug' element={<MoviePage />} />
					</Route>
				</Routes>
		</div>
	);
}

export default App;