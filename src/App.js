import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./pages/Sign In";
import { Box } from "@mui/material";

function App() {
    return (
        <Box>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
            </Routes>
        </Box>
    );
}

export default App;
