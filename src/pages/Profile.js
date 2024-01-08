import { useNavigate, useParams } from "react-router-dom";
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

function Profile() {
    const navigate = useNavigate();

    const { username } = useParams();

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
        username: undefined,
        likesCount: undefined,
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


    useEffect(() => {
        setIsReviewCardsLoading(true);
        getUserReviews(username, page, sortInfo.sortTarget, sortInfo.sortType, userReviews => {
            setReviewCards(userReviews);
            setIsReviewCardsLoading(false);
        });
        getUserReviewPagesCount(username, pagesCount => {
            setPagesCount(pagesCount);
        });
    }, [page, sortInfo]);

    useEffect(() => {
        getUserInfo(username, userInfo => {
            setUserInfo({
                username: userInfo.userName,
                likesCount: userInfo.likesCount,
                isLoading: false
            });
        });
        checkAccessToCreateReview(username, () => {
            setCanCreateReview(true);
        }, () => {
            setCanCreateReview(false);
        });
    }, []);


    const UserInfo = ({ sx }) => {
        return (
            <Paper sx={{
                ...sx,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
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
                    text={
                        userInfo.isLoading ? <Skeleton width={20} /> : userInfo.likesCount
                    }
                />
            </Paper>
        );
    };

    const UserReviews = ({ sx }) => {
        return (
            <Paper sx={{
                ...sx,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 2
            }}
            >
                <Typography variant="h5">
                    Reviews
                </Typography>
                {canCreateReview &&
                    <Button
                        variant="contained"
                        onClick={() => navigate("/review/new")}
                    >
                        Create New
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
                    sx={{
                        mt: 4
                    }}
                />
                {pagesCount > 1 &&
                    <Pagination 
                        count={pagesCount}
                        page={page}
                        onChange={(e, val) => setPage(val)}
                        color="primary"
                        shape="rounded"
                    />
                }
            </Paper>
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