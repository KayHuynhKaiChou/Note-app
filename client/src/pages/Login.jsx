import {Button, Typography} from '@mui/material'
import { GoogleAuthProvider , getAuth, signInWithPopup } from 'firebase/auth'
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { Navigate } from 'react-router-dom';
import { graphQL_Request } from '../utils/request';

export default function Login() {
    const auth = getAuth(); 
    //const navigate = useNavigate();
    // eslint-disable-next-line no-unused-vars
    const { user } = useContext(AuthContext);

    const handleLoginWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        console.log('ssssssss')
        const {user: { uid, displayName}} = await signInWithPopup(auth, provider);
        
        const {data} = await graphQL_Request({
            query : `mutation register($uid: String!, $name: String!) {
                register(uid: $uid, name: $name) {
                   uid
                   name 
                }
            }`,
            variables: {
                uid,
                name: displayName
            }
        });
        console.log('Register',data);
    }

    if(localStorage.getItem('accessToken')){
        return <Navigate to="/"/>
    }

    return (
        <>
            <Typography>Welcome to noteApp</Typography>
            <Button variant='outlined' onClick={handleLoginWithGoogle}>
                Login with Google
            </Button>
        </>
    )
}