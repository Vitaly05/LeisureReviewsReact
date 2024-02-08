import { Button, Container, Paper, Typography } from "@mui/material";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";

function NotFound() {
    const { t } = useTranslation();

    return (
        <>
            <Header />
            <Container>
                <Paper sx={{
                    mt: 2,
                    p: 2,
                    gap: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                }}
                >
                    <Typography variant="h4">
                        {t("Resource not found")}
                    </Typography>
                    <Button
                        size="large"
                        onClick={() => window.location.href = "/"}
                    >
                        {t("Go to home")}
                    </Button>
                </Paper>
            </Container>
        </>
    );
}

export default NotFound;