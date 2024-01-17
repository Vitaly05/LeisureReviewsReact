import { Box, Button, Checkbox, Container, Divider, FormControlLabel, FormGroup, FormHelperText, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { signUp } from "../api";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";

function SignUp() {
    const { t } = useTranslation();

    const validationSchema = Yup.object({
        username: Yup.string().required(t("Please enter username")),
        password: Yup.string().required(t("Please enter password"))
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            rememberMe: false
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            signUp(values, () => {
                navigate("/");
            }, (reason) => {
                if (reason.response.data.code === 2) {
                    console.error(reason.response.data.message);
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
                        <Typography 
                            component="h1"
                            variant="h5"
                        >
                            {t("Sign Up")}
                        </Typography>
                        <Divider sx={{ width: "100%" }} />
                    </Box>
                    <TextField
                        fullWidth
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
                    <TextField
                        fullWidth
                        type="password"
                        autoComplete="password"
                        label={t("Password")}
                        id="password"
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && !!formik.errors.password}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                    <Box sx={{ width: "100%" }}>
                        <FormGroup>
                            <FormControlLabel
                                control={<Checkbox />}
                                label={
                                    <Typography variant="body2">
                                        {t("Remember me")}
                                    </Typography>
                                }
                                id="rememberMe"
                                name="rememberMe"
                                value={formik.values.rememberMe}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.rememberMe && !!formik.errors.rememberMe}
                                helperText={formik.touched.rememberMe && formik.errors.rememberMe}
                            />
                        </FormGroup>
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
                        alignItems: "center",
                        gap: 1
                    }}
                    >
                        <Typography variant="body2">
                            {t("Already have an account?")}
                        </Typography>
                        <Button onClick={() => navigate("/sign-in")}>
                            {t("Sign In")}
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </form>
      );
}

export default SignUp;