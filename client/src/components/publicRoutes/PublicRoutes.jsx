import React  from 'react';

import {Navigate, Outlet} from 'react-router-dom'

const  PublicRoutes=({auth}) =>{
  return auth === true ? <Navigate to="/library" /> : <Outlet/>
}

export default PublicRoutes;