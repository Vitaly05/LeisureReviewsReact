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

function App() {
    return (
        <>
            <BgParticles />
            <Box>
                <GoogleOneTapLogin />
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
