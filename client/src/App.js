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
import Loading from "./components/Loading";
import Error404 from "./components/Error404";
import AuthError from "./components/AuthError";

function App() {
	const location = useLocation();
	const [auth, setAuth] = useState(null);
    const dispatch = useDispatch()
	const navigate = useNavigate()
	const slug = localStorage.getItem('resetToken')
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		const check = async () => {

			const res = await checkAuth()
			if (res === true)
			{
				const tokenInst = localStorage.getItem('authToken');
				const res = await instance.post('/user/getInfos', {
					token: tokenInst,
					type: 0
				})
				if (res.data.status === 0) {
					swal({
						title: "Oooooooops",
						text: "Something gone Wrong Please Try Again",
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
		setIsLoading(true);
		setTimeout(() => {
			setIsLoading(false)
		}, 1500)
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
		<>
			<Loading isLoading={isLoading}/>
			<div className={!isLoading ? "flex flex-col" : "hidden"}>
				<Navbar />
				<Routes>
					<Route path="/" element={<PublicRoutes auth={auth} />}>
						<Route path='/' element={<Home />}/>
						<Route path='/signIn' element={<Signin />} />
						<Route path='/signUp' element={<SignUp />} />
						<Route path='/auth/forgetPassword' element={<ForgetPassword />} />
						<Route path='/confirm/:slug' element={<Confirm />} />
						<Route path='/auth/resetPassword/:slug' element={<ResetPassword />} />
						<Route path='/authError/:slug' element={<AuthError />} />
					</Route>
					<Route path="/" element={<PrivateRoutes auth={auth} />}>
						<Route path='/user/profile' element={<Profile />} />
						<Route path='/library' element={<Library />} />
						<Route path='/movie/:slug' element={<MoviePage />} />
					</Route>
					<Route path="*" element={<Error404 />}/>
				</Routes>
			</div>
			
		</>
		
	);
}

export default App;