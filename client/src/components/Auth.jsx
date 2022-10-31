import instance  from "./instances/instance";

const checkAuth = async () => {
    const auth = localStorage.getItem('authToken');

    if (auth) {
        const res = await instance.post('/auth/confirm', {
            token: auth,
            type: 0,
        });
        if (res.data.status === 0)
            return (false)
        else
            return(true)
    } else  
        return false
}

export default checkAuth