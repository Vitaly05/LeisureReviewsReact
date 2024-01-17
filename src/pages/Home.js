import { Box, Button, Container, Pagination } from "@mui/material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getReviewPagesCount, getReviewsPage } from "../api";
import { SortTarget, SortType } from "../data/SortParams";
import ReviewCardsList from "../components/ReviewCardsList";
import TagsCloud from "../components/TagsCloud";
import { useTranslation } from "react-i18next";

function Home() {
    const { t } = useTranslation();

    const [pagesCount, setPagesCount] = useState(0);
    const [sortTarget, setSortTarget] = useState(SortTarget.date);
    const [page, setPage] = useState(1);

    const [reviewCards, setReviewCards] = useState([]);
    const [isReviewCardsLoading, setIsReviewCardsLoading] = useState(true);

    const [isTagsCloudOpen, setIsTagsCloudOpen] = useState(false);

    useEffect(() => {
        setIsReviewCardsLoading(true);
        getReviewsPage(page, sortTarget, SortType.descending, (cards) => {
            setReviewCards(cards);
            setIsReviewCardsLoading(false);
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
                        onClick={() => setIsTagsCloudOpen(true)}
                    >
                        {t("Tags Cloud")}
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
                            {t("Latest Reviews")}
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                width: 250
                            }}
                            disabled={sortTarget === SortTarget.rate}
                            onClick={() => setSortTarget(SortTarget.rate)}
                        >
                            {t("Top-Rated Reviews")}
                        </Button>
                    </Box>
                </Box>
                <ReviewCardsList
                    isLoading={isReviewCardsLoading}
                    reviewCards={reviewCards}
                    sx={{
                        mt: 4
                    }}
                />
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
            
            <TagsCloud open={isTagsCloudOpen} onClose={() => setIsTagsCloudOpen(false)} />
        </>
    );
}

export default Home;