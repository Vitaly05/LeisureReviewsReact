import { Badge, Box, Button, Container, Pagination, Paper } from "@mui/material";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { getReviewPagesCount, getReviewPagesCountByTags, getReviewsPageByTags } from "../api";
import { SortTarget, SortType } from "../data/SortParams";
import ReviewCardsList from "../components/ReviewCardsList";
import TagsCloud from "../components/TagsCloud";
import { useTranslation } from "react-i18next";
import TagsFilteringDialog from "../components/TagsFilteringDialog";

function Home() {
    const { t } = useTranslation();

    const [pagesCount, setPagesCount] = useState(0);
    const [sortTarget, setSortTarget] = useState(SortTarget.date);
    const [page, setPage] = useState(1);
    const [tags, setTags] = useState([]);

    const [reviewCards, setReviewCards] = useState([]);
    const [isReviewCardsLoading, setIsReviewCardsLoading] = useState(true);

    const [isTagsCloudOpen, setIsTagsCloudOpen] = useState(false);

    const [tagFiltersCount, setTagFiltersCount] = useState(0);
    const [isTagsFilteringOpen, setIsTagsFilteringOpen] = useState(false);

    const applyTagsFilteringHandler = (tags) => {
        setIsTagsFilteringOpen(false);
        getReviewPagesCountByTags(tags, (count) => {
            
            setPagesCount(count);
            setPage(1);
            setTags(tags);
        });
    };

    useEffect(() => {
        setTagFiltersCount(tags.length);
    }, [tags]);

    useEffect(() => {
        setIsReviewCardsLoading(true);
        getReviewsPageByTags(page, sortTarget, SortType.descending, tags, (cards) => {
            setReviewCards(cards);
            setIsReviewCardsLoading(false);
        });
    }, [page, sortTarget, tags]);

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
                <Paper
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2,
                        mt: 2,
                        p: 2,
                        mx: "auto",
                        minWidth: {
                            xs: 300,
                            sm: 500,
                        },
                        width: {
                            xs: 300,
                            sm: 500,
                            md: 700
                        }
                    }}
                >
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 2
                    }}
                    >
                        <Button
                            variant="text"
                            size="medium"
                            onClick={() => setIsTagsCloudOpen(true)}
                        >
                            {t("Tags Cloud")}
                        </Button>
                        <Badge badgeContent={tagFiltersCount} color="secondary">
                            <Button
                                variant="text"
                                size="medium"
                                onClick={() => setIsTagsFilteringOpen(true)}
                            >
                                {t("Tags filtering")}
                            </Button>
                        </Badge>
                    </Box>
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
                                width: 200
                            }}
                            disabled={sortTarget === SortTarget.date}
                            onClick={() => setSortTarget(SortTarget.date)}
                        >
                            {t("Latest Reviews")}
                        </Button>
                        <Button
                            variant="outlined"
                            sx={{
                                width: 200
                            }}
                            disabled={sortTarget === SortTarget.likes}
                            onClick={() => setSortTarget(SortTarget.likes)}
                        >
                            {t("Top Reviews")}
                        </Button>
                    </Box>
                </Paper>
                <ReviewCardsList
                    isLoading={isReviewCardsLoading}
                    reviewCards={reviewCards}
                    sx={{
                        my: 4
                    }}
                />
                {pagesCount > 1 &&
                    <Paper sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 4,
                        mx: "auto",
                        py: 1,
                        minWidth: {
                            xs: 300,
                            sm: 500,
                        },
                        width: {
                            xs: 300,
                            sm: 500,
                            md: 700
                        }
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
            </Container>
            
            <TagsCloud 
                open={isTagsCloudOpen} 
                onClose={() => setIsTagsCloudOpen(false)} 
                onTagClick={(tag) => {
                    applyTagsFilteringHandler([ tag ]);
                    setIsTagsCloudOpen(false);
                }}
            />
            <TagsFilteringDialog 
                initValues={tags}
                open={isTagsFilteringOpen} 
                onClose={() => setIsTagsFilteringOpen(false)} 
                onApply={applyTagsFilteringHandler}
            />
        </>
    );
}

export default Home;