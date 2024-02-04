import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredential } from "../redux/slices/googleAuthSlice";
import { googleSignIn } from "../api";
import { useGoogleOneTapLogin } from "@react-oauth/google";

function GoogleOneTapLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onGoogleSignInSuccess = async (credentialResponse) => {
        await dispatch(setCredential(credentialResponse.credential));
        googleSignIn(credentialResponse.credential, () => {
            console.log("Successful login by Google");
        }, () => {
            navigate(`/additional-info?return-url=${window.location.pathname}`);
        });
    };
    
    useGoogleOneTapLogin({
        onSuccess: onGoogleSignInSuccess,
    });
}

export default GoogleOneTapLogin;