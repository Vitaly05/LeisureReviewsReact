import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { Box, Button, Container, Pagination, Paper, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import IconWithText from "../components/IconWithText";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { SortTarget, SortType } from "../data/SortParams";
import SortPanel from "../components/SortPanel";
import { checkAccessToCreateReview, getUserInfo, getUserReviewPagesCount, getUserReviews } from "../api";
import ReviewCardsList from "../components/ReviewCardsList";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function Profile() {
    const { t } = useTranslation();

    const { username } = useParams();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [canCreateReview, setCanCreateReview] = useState(false);

    const [pagesCount, setPagesCount] = useState(0);
    const [sortInfo, setSortInfo] = useState({
        sortTarget: SortTarget.date,
        sortType: SortType.descending
    });
    const [page, setPage] = useState(1);

    const [reviewCards, setReviewCards] = useState([]);
    const [isReviewCardsLoading, setIsReviewCardsLoading] = useState(true);

    const [userInfo, setUserInfo] = useState({
        id: "",
        username: "",
        likesCount: 0,
        isLoading: true
    });

    const sortPanelTargets = [SortTarget.date, SortTarget.rate, SortTarget.likes];

    const handleSortPanelClick = (sortTarget, sortType) => {
        setIsReviewCardsLoading(true);
        setSortInfo({
            sortTarget: sortTarget,
            sortType: sortType
        });
    };

    const handleCreateReviewButton = async () => {
        window.location.href = `/review/new/${userInfo.id}`;
    };

    const getReviewsList = () => {
        setIsReviewCardsLoading(true);
        getUserReviews(username, page, sortInfo.sortTarget, sortInfo.sortType, userReviews => {
            setReviewCards(userReviews);
            setIsReviewCardsLoading(false);
        });
        getUserReviewPagesCount(username, pagesCount => {
            setPagesCount(pagesCount);
        });
    };

    useEffect(() => {
        if (isAuthenticated && userInfo.id) {
            checkAccessToCreateReview(userInfo.id, () => {
                setCanCreateReview(true);
            }, () => {
                setCanCreateReview(false);
            });
        } else {
            setCanCreateReview(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        getReviewsList();
    }, [page, sortInfo]);

    useEffect(() => {
        checkAccessToCreateReview(userInfo.id, () => {
            setCanCreateReview(true);
        }, () => {
            setCanCreateReview(false);
        });
    }, [userInfo.id]);

    useEffect(() => {
        if (!username) {
            window.location.href = "/not-found";
        }
        getUserInfo(username, userInfo => {
            setUserInfo({
                id: userInfo.id,
                username: userInfo.userName,
                likesCount: userInfo.likesCount,
                isLoading: false
            });
        }, () => window.location.href = "/not-found");
    }, [username]);


    const UserInfo = ({ sx }) => {
        return (
            <Paper sx={{
                ...sx,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
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
                    gap: 1
                }}
                >
                    <PersonIcon />
                    {userInfo.isLoading ? (
                        <Skeleton width={100} />
                    ) : (
                    <>
                        <Typography textTransform="none">
                            {userInfo.username}
                        </Typography>
                    </>
                    )}
                </Box>
                <IconWithText
                    icon={<FavoriteBorderIcon />}
                    text={userInfo.isLoading ? <Skeleton width={20} /> : userInfo.likesCount}
                    title={t("User likes count")}
                />
            </Paper>
        );
    };

    const UserReviews = ({ sx }) => {
        return (
            <Box sx={{
                ...sx,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
            }}
            >
                <Typography variant="h5">
                    {t("Reviews")}
                </Typography>
                {canCreateReview &&
                    <Button
                        variant="contained"
                        onClick={handleCreateReviewButton}
                    >
                        {t("Create review")}
                    </Button>
                }
                <Box sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row"
                    },
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1
                }}
                >
                    {sortPanelTargets.map(target => 
                        <SortPanel 
                            key={target} 
                            sortTarget={target}
                            activeSortTarget={sortInfo.sortTarget}
                            activeSortType={sortInfo.sortType}
                            onClick={handleSortPanelClick}
                        />
                    )}
                </Box>
                <ReviewCardsList
                    reviewCards={reviewCards}
                    isLoading={isReviewCardsLoading}
                    canEdit={canCreateReview}
                    updateListMethod={getReviewsList}
                    sx={{
                        my: 4,
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
            </Box>
        );
    };

    return (
        <>
            <Header />
            <Container>
                <UserInfo sx={{
                    mt: 2,
                    py: 5,
                    px: 2
                }} 
                />
                <UserReviews sx={{
                    mt: 2,
                    py: 5,
                    px: 2
                }}
                />
            </Container>
        </>
    );
}

export default Profile;