import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home";
import SignIn from "./pages/Sign In";
import SignUp from "./pages/Sign Up";
import Profile from "./pages/Profile";

function App() {
    return (
        <Box>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/user/:username" element={<Profile />} />
            </Routes>
        </Box>
    );
}

export default App;
