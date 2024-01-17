import { Box, CircularProgress, Container, Pagination, Typography } from "@mui/material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getUsersPage, getUsersPagesCount } from "../api";
import User from "../components/User";

function AdminPanel() {
    const [isAccessDenied, setIsAccessDenied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [pagesCount, setPagesCount] = useState(0);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);


    useEffect(() => {
        getUsersPage(page, (data) => {
            setUsers(data);
        }, () => {
            setIsAccessDenied(true);
        }, () => {
            setIsLoading(false);
        });
    }, [page]);

    useEffect(() => {
        getUsersPagesCount((data) => {
            setPagesCount(data);
        }, () => {
            setIsAccessDenied(true);
        });
    }, []);


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
                    Access denied
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
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Pagination
                            count={pagesCount}
                            page={page}
                            onChange={(e, val) => setPage(val)}
                            color="primary"
                            shape="rounded"
                        />
                    </Box>
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