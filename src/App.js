import { Route, Routes, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import EditReview from "./pages/EditReview";
import Review from "./pages/Review";
import AdminPanel from "./pages/AdminPanel";
import BgParticles from "./components/BgParticles";
import AdditionalInfo from "./pages/AdditionalInfo";
import { useGoogleOneTapLogin } from "@react-oauth/google";
import { useDispatch, useSelector } from "react-redux";
import { setCredential } from "./redux/slices/googleAuthSlice";
import { googleSignIn } from "./api";

function App() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const onGoogleSignInSuccess = async (credentialResponse) => {
        await dispatch(setCredential(credentialResponse.credential));
        googleSignIn(credentialResponse.credential, () => {
            //navigate(returnUrl || "/");
        }, () => {
            navigate(`/additional-info?return-url=${window.location.pathname}`);
        });
    };

    useGoogleOneTapLogin({
        onSuccess: onGoogleSignInSuccess,
        disabled: isAuthenticated
    });

    return (
        <>
            <BgParticles />
            <Box>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/sign-in" element={<SignIn />} />
                    <Route path="/sign-up" element={<SignUp />} />
                    <Route path="/additional-info" element={<AdditionalInfo />} />
                    <Route path="/user/:username" element={<Profile />} />
                    <Route path="/review">
                        <Route path=":reviewId" element={<Review />} />
                        <Route path="new/:authorId" element={<EditReview />} />
                        <Route path="edit/:reviewId" element={<EditReview />} />
                    </Route>
                    <Route path="/adminpanel" element={<AdminPanel />} />
                </Routes>
            </Box>
        </>
    );
}

export default App;
