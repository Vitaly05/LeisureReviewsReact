import { Route, Routes } from "react-router-dom";
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
import GoogleOneTapLogin from "./components/GoogleOneTapLogin";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

function App() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [showGoogleOneTapLogin, setShowGoogleOneTapLogin] = useState(false);

    useEffect(() => {
        const showGoogleLoginTimer = setTimeout(() => {
            setShowGoogleOneTapLogin(true);
        }, 2000);

        return () => {
            clearTimeout(showGoogleLoginTimer);
        };
    });

    return (
        <>
            <BgParticles />
            <Box>
                {showGoogleOneTapLogin && !isAuthenticated && 
                    <GoogleOneTapLogin />
                }
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
