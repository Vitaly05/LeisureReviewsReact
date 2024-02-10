import { Box, CircularProgress, Container, Pagination, Paper, Typography } from "@mui/material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getUsersPage, getUsersPagesCount } from "../api";
import User from "../components/User";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function AdminPanel() {
    const { t } = useTranslation();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [isAccessDenied, setIsAccessDenied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pagesCount, setPagesCount] = useState(0);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);


    useEffect(() => {
        setIsLoading(true);
        getUsersPage(page, (data) => {
            setUsers(data);
        }, () => {
            setIsAccessDenied(true);
        }, () => {
            setIsLoading(false);
        });
    }, [page]);

    useEffect(() => {
        if (!isAuthenticated) {
            setIsAccessDenied(true);
        } else {
            getUsersPagesCount((data) => {
                setIsAccessDenied(false);
                setPagesCount(data);
            }, () => {
                setIsAccessDenied(true);
            });
        }
    }, [isAuthenticated]);


    const Content = () => {
        if (isLoading) {
            return (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <CircularProgress />
                </Box>
            );
        }
        if (isAccessDenied) {
            return (
                <Typography textAlign="center" sx={{ mt: 2 }}>
                    {t("Access denied")}
                </Typography>
            );
        }
        return (
            <Box sx={{ 
                my: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2
            }}
            >
                {users.map((user, i) => 
                    <User model={user} key={i} />
                )}
                {pagesCount > 1 &&
                    <Paper sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 4,
                        mx: "auto",
                        py: 1,
                        width: "100%"
                    }}
                    >
                        <Pagination 
                            count={pagesCount}
                            page={page}
                            onChange={(e, val) => setPage(val)}
                            color="primary"
                            shape="rounded"
                        />
                    </Paper>
                }
            </Box>
            
        );
    };

    return (
        <>
            <Header />
            <Container>
                <Content />
            </Container>
        </>
    );
}

export default AdminPanel;