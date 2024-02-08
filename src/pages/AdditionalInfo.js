import { Box, Container, Divider, FormHelperText, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { LoadingButton } from "@mui/lab";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { googleSignUp } from "../api";
import { clearCredential } from "../redux/slices/googleAuthSlice";
import * as Yup from "yup";

function AdditionalInfo() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get("return-url");

    const usernameValidationSchema = Yup.string().required(t("Please enter username"));
    
    const credential = useSelector(state => state.googleAuth.credential);

    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState("");

    const handleSignUpClick = async () => {
        try {
            await usernameValidationSchema.validate(username);
            setErrorMessage("");

            googleSignUp(username, credential, () => {
                dispatch(clearCredential());
                navigate(returnUrl || "/");
            }, (errorCode) => {
                if (errorCode === 3) {
                    setErrorMessage(t("Username is already taken"));
                }
            });
        } catch (err) {
            if (err.name === "ValidationError") {
                setErrorMessage(err.message);
            }
        }
    };

    useEffect(() => {
        if (!credential) {
            navigate(`/sign-in?return-url=${returnUrl}`);
        }
    }, []);

    return (
        <Container
            component="main"
            maxWidth="sm"
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <Paper
                elevation={5}
                sx={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "start",
                    gap: 3
                }}
            >
                <Box sx={{ 
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1
                }}
                >
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                    >
                        <Typography 
                            component="h1"
                            variant="h5"
                        >
                            {t("Additional Info")}
                        </Typography>
                        <IconButton onClick={() => navigate("/")}>
                            <HomeIcon />
                        </IconButton>
                    </Box>
                    <Divider sx={{ width: "100%" }} />
                </Box>
                <TextField
                    fullWidth
                    label={t("Username")}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Box sx={{ width: "100%" }}>
                    <LoadingButton
                        loading={isLoading}
                        variant="contained"
                        sx={{ width: "100%" }}
                        onClick={handleSignUpClick}
                    >
                        {t("Sign Up")}
                    </LoadingButton>
                    {errorMessage &&
                            <FormHelperText error>
                                {errorMessage}
                            </FormHelperText>
                        }
                </Box>
            </Paper>
        </Container>
    );
}

export default AdditionalInfo;