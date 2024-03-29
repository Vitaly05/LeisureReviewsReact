import { Box, Button, Container, Divider, FormHelperText, IconButton, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { signUp } from "../api";
import { useNavigate, useSearchParams } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import HomeIcon from "@mui/icons-material/Home";
import ExternalSignIn from "../components/ExternalSignIn";
import SecretField from "../components/SecretField";
import BasicTooltip from "../components/BasicTooltip";

function SignUp() {
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
        confirmPassword: Yup.string().required(t("Please confirm password")).oneOf([Yup.ref("password")], t("Passwords don't match"))
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            confirmPassword: ""
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            signUp(values, () => {
                navigate(returnUrl || "/");
            }, (reason) => {
                if (reason.response.data.code === 3) {
                    setErrorMessage(t("Username is already taken"));
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
                                {t("Sign Up")}
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
                    <SecretField
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
                    <SecretField
                        id="confirmPassword"
                        name="confirmPassword"
                        autoComplete="password"
                        label={t("Confirm password")}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && !!formik.errors.confirmPassword}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                    />
                    <Box sx={{ width: "100%" }}>
                        <LoadingButton
                            loading={isLoading}
                            variant="contained"
                            sx={{ width: "100%" }}
                            type="submit"
                        >
                            {t("Sign Up")}
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
                            {t("Already have an account?")}
                        </Typography>
                        <Button onClick={() => navigate(`/sign-in?return-url=${returnUrl}`)}>
                            {t("Sign In")}
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

export default SignUp;