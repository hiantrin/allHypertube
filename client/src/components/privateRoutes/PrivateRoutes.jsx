import React  from 'react';

import {Navigate, Outlet} from 'react-router-dom'

const  PrivateRoutes=({auth}) =>{
  return auth === false ? <Navigate to="/signIn"/> : <Outlet/>
}

export default PrivateRoutes;