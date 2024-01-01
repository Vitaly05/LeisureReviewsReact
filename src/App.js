import { Route, Routes } from "react-router-dom";
import { Box } from "@mui/material";
import Home from "./pages/Home";
import SignIn from "./pages/Sign In";
import SignUp from "./pages/Sign Up";

function App() {
    return (
        <Box>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
            </Routes>
        </Box>
    );
}

export default App;
