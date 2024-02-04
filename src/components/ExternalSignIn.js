import { Box } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { setCredential } from "../redux/slices/googleAuthSlice";
import { googleSignIn } from "../api";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function ExternalSignIn({ returnUrl }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onGoogleSignInSuccess = async (credentialResponse) => {
        await dispatch(setCredential(credentialResponse.credential));
        googleSignIn(credentialResponse.credential, () => {
            navigate(returnUrl || "/");
        }, () => {
            navigate(`/additional-info?return-url=${returnUrl}`);
        });
    };

    return (
        <Box sx={{
            width: "100%",
            display: "flex",
            justifyContent: "center"
        }}
        >
            <GoogleLogin
                onSuccess={onGoogleSignInSuccess}
                type="icon"
                shape="circle"
                className="fff"
            />
        </Box>
    );
}

export default ExternalSignIn;