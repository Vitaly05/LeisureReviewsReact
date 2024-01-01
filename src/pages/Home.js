import { Box, Button, Container, Pagination } from "@mui/material";
import Header from "../components/Header";
import ReviewCard from "../components/ReviewCard";
import { useEffect, useState } from "react";
import { getReviewPagesCount, getReviewsPage } from "../api";
import { SortTarget, SortType } from "../data/SortParams";

function Home() {
    const [pagesCount, setPagesCount] = useState(0);
    const [sortTarget, setSortTarget] = useState(SortTarget.date);
    const [page, setPage] = useState(1);
    const [reviewCards, setReviewCards] = useState([]);

    useEffect(() => {
        getReviewsPage(page, sortTarget, SortType.descending, (cards) => {
            setReviewCards(cards);
        });
    }, [page, sortTarget]);

    useEffect(() => {
        getReviewPagesCount((count) => {
            setPagesCount(count);
        });
    }, []);

    return (
        <>
            <Header />
            <Container>
                {/* Buttons */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        mt: 2
                    }}
                >
                    <Button
                        variant="text"
                        size="large"
                        sx={{
                            textTransform: "none"
                        }}
                    >
                        Tags cloud
                    </Button>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column",
                                sm: "row"
                            },
                            alignItems: "center",
                            justifyContent: "center",
                            gap: {
                                xs: 1,
                                sm: 4
                            }
                        }}
                    >
                        <Button
                            variant="outlined"
                            sx={{
                                width: 250
                            }}
                            disabled={sortTarget === SortTarget.date}
                            onClick={() => setSortTarget(SortTarget.date)}
                        >
                            Latest Reviews
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                width: 250
                            }}
                            disabled={sortTarget === SortTarget.rate}
                            onClick={() => setSortTarget(SortTarget.rate)}
                        >
                            Top-Rated Reviews
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 4,
                        mt: 4
                    }}
                >
                    {reviewCards.map((card, i) =>
                        <ReviewCard reviewCardModel={card} key={i} />
                    )}
                </Box>
                <Box sx={{
                    display: "flex",
                    justifyContent: "center",
                    my: 4
                }}
                >
                    {pagesCount > 1 &&
                        <Pagination 
                            count={pagesCount}
                            page={page}
                            onChange={(e, val) => setPage(val)}
                            color="primary"
                            shape="rounded"
                        />
                    }
                </Box>
            </Container>
        </>
    );
}

export default Home;