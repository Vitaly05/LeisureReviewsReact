import { Box, Checkbox, Container, Divider, FormControlLabel, FormGroup, FormHelperText, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { signIn } from "../api";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LoadingButton } from "@mui/lab";

const validationSchema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required()
});

function SignIn() {
    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            rememberMe: false
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            signIn(values, () => {
                navigate("/");
            }, (reason) => {
                if (reason.response.data.code === 1) {
                    setErrorMessage("Incorrect username or password");
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
                            Sign In
                        </Typography>
                        <Divider sx={{ width: "100%" }} />
                    </Box>
                    <TextField
                        autoComplete="username"
                        label="Username"
                        id="username"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.username && !!formik.errors.username}
                        helperText={formik.touched.username && formik.errors.username}
                    />
                    <TextField
                        type="password"
                        autoComplete="password"
                        label="Password"
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
                                label="Remember me"
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
                            Sign In
                        </LoadingButton>
                        {errorMessage.length > 0 &&
                            <FormHelperText sx={{color: "red"}}>
                                {errorMessage}
                            </FormHelperText>
                        }
                    </Box>
                </Paper>
            </Container>
        </form>
      );
}

export default SignIn;