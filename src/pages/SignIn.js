import { Box, Button, Container, Divider, FormHelperText, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { signIn } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
import ExternalSignIn from "../components/ExternalSignIn";
import PasswordField from "../components/SecretField";
import BasicTooltip from "../components/BasicTooltip";

function SignIn() {
    const { t } = useTranslation();

    const [searchParams] = useSearchParams();
    const returnUrl = searchParams.get("return-url");

    const validationSchema = Yup.object({
        username: Yup
            .string()
            .trim()
            .required(t("Please enter username"))
            .min(5, t("Username must be at least 5 characters")),
        password: Yup
            .string()
            .trim()
            .required(t("Please enter password"))
            .min(10, t("Passwords must be at least 10 characters"))
            .matches(/\d/g, t("Passwords must have at least one digit"))
            .matches(/[a-z]/g, t("Passwords must have at least one lowercase"))
            .matches(/[A-Z]/g, t("Passwords must have at least one uppercase")),
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            signIn(values, () => {
                navigate(returnUrl || "/");
            }, (reason) => {
                if (reason.response.data.code === 1) {
                    setErrorMessage(t("Incorrect username or password"));
                } else if (reason.response.data.code === 2) {
                    setErrorMessage(t("Account has been blocked"));
                }
            }, () => setIsLoading(false));
        }
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    return (
        <form onSubmit={formik.handleSubmit}>
            <Container
                component="main"
                maxWidth="sm"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100dvh",
                }}
            >
                <Paper
                    elevation={5}
                    sx={{
                        padding: "20px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        gap: 3,
                        minWidth: {
                            xs: 250,
                            md: 500
                        }
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
                                {t("Sign In")}
                            </Typography>
                            <BasicTooltip title={t("Back to home")}>
                                <IconButton onClick={() => navigate("/")}>
                                    <HomeIcon />
                                </IconButton>
                            </BasicTooltip>
                        </Box>
                        <Divider sx={{ width: "100%" }} />
                    </Box>
                    <TextField
                        fullWidth
                        autoFocus
                        autoComplete="username"
                        label={t("Username")}
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && !!formik.errors.username}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <PasswordField
                        id="password"
                        name="password"
                        autoComplete="password"
                        label={t("Password")}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && !!formik.errors.password}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Box sx={{ width: "100%" }}>
                        <LoadingButton
                            loading={isLoading}
                            variant="contained"
                            sx={{ width: "100%" }}
                            type="submit"
                        >
                            {t("Sign In")}
                        </LoadingButton>
                        {errorMessage.length > 0 &&
                            <FormHelperText error>
                                {errorMessage}
                            </FormHelperText>
                        }
                    </Box>
                    <Box sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                        width: "100%"
                    }}
                    >
                        <Typography variant="body2">
                            {t("Don't have an account?")}
                        </Typography>
                        <Button onClick={() => navigate(`/sign-up?return-url=${returnUrl}`)}>
                            {t("Sign Up")}
                        </Button>
                    </Box>
                    <Divider style={{ width: "100%"}}>
                        <Typography variant="body2">
                            {t("Or")}
                        </Typography>
                    </Divider>
                    <ExternalSignIn returnUrl={returnUrl} />
                </Paper>
            </Container>
        </form>
      );
}

export default SignIn;