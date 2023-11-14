import { createContext, useState , useEffect } from "react"
import { getAuth } from 'firebase/auth'
import { useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }){
    const [user,setUser] = useState({});
    const navigate = useNavigate();
    const auth = getAuth();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // khi access token hết hạn thì firebase tự động refresh token
        const unsubcribed = auth.onIdTokenChanged((user) => { // when login , logout , refreshToken sẽ thực thi
            console.log('user:')
            console.log(user); //log ra để thấy các property của user khi login thành công
            if(user?.uid){
                setUser(user);
                if (user.accessToken !== localStorage.getItem('accessToken')) {
                    localStorage.setItem('accessToken', user.accessToken);
                    window.location.reload();
                }
                setIsLoading(false);
                return;
            }

            //reset user info
            console.log("reset")
            setUser({});
            setIsLoading(false);
            localStorage.clear();
            navigate('/login')
        })

        return () => {
            unsubcribed();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[auth]);

    return (
        <AuthContext.Provider value={{user,setUser}}>
            {isLoading ? <CircularProgress /> : children}
        </AuthContext.Provider>
    )
}

export default AuthProvider