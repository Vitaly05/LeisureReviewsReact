import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { checkAccessToEditReview, checkAccessToLikeReview, getLeisureInfo, getRate, getRelatedReviews, getReview, getUserInfoById, likeReview, rateLeisure } from "../api";
import { LeisureGroupsNames } from "../data/LeisureGroups";
import { Alert, Box, Button, Chip, CircularProgress, Container, Paper, Rating, Snackbar, Stack, Typography } from "@mui/material";
import IconWithText from "../components/IconWithText";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonIcon from "@mui/icons-material/Person";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { AdmonitionDirectiveDescriptor, MDXEditor, directivesPlugin, headingsPlugin, imagePlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin } from "@mdxeditor/editor";
import ReviewCard from "../components/ReviewCard";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import Comments from "../components/Comments";
import BasicTooltip from "../components/BasicTooltip";
import EditIcon from "@mui/icons-material/Edit";

function Review() {
    const { t } = useTranslation();

    const [isReadOnly, setIsReadOnly] = useState(false);

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const { reviewId } = useParams();

    const [reviewInfo, setReviewInfo] = useState({});
    const [authorInfo, setAuthorInfo] = useState({
        name: "",
        likesCount: 0,
        isLoading: true
    });
    const [leisureInfo, setLeisureInfo] = useState({
        id: "",
        name: "",
        averageRate: undefined,
        isLoading: true
    });

    const [relatedReviews, setRelatedReviews] = useState([]);

    const [canLike, setCanLike] = useState(false);
    const [isLikeButtonLoading, setIsLikeButtonLoading] = useState(false);
    const [likeSuccessAlertOpen, setLikeSuccessAlertOpen] = useState(false);

    const [signInAlertOpen, setSignInAlertOpen] = useState(false);

    const [userRating, setUserRating] = useState(0);

    const [canEditReview, setCanEditReview] = useState(false);


    useEffect(() => {
        if (isAuthenticated && reviewId) {
            checkAccessToEditReview(reviewId, () => {
                setCanEditReview(true);
            }, () => {
                setCanEditReview(false);
            });
        } else {
            setCanEditReview(false);
        }
    }, [isAuthenticated]);

    const likeButtonClickHandler = () => {
        setIsLikeButtonLoading(true);

        likeReview(reviewInfo.id, () => {
            setReviewInfo(prevState => ({
                ...prevState,
                likesCount: prevState.likesCount + 1
            }));
            setAuthorInfo(prevState => ({
                ...prevState,
                likesCount: prevState.likesCount + 1
            }));
            setCanLike(false);
            setLikeSuccessAlertOpen(true);
        }, () => {
            setIsLikeButtonLoading(false);
        });
    };

    const ratingClickHandler = (e, newValue) => {
        if (isAuthenticated) {
            setUserRating(newValue);
            rateLeisure(leisureInfo.id, newValue, newAvgRate => {
                setLeisureInfo(prevState => ({
                    ...prevState,
                    averageRate: newAvgRate
                }));
            });
        } else {
            setSignInAlertOpen(true);
        }
    };

    const updateAuthorData = (userData) => {
        setAuthorInfo({
            name: userData.userName,
            likesCount: userData.likesCount,
            isLoading: false
        });
    };

    const updateLeisureData = (leisureData) => {
        setLeisureInfo({
            ...leisureData,
            isLoading: false
        });
        getRate(leisureData.id, rate => {
            setUserRating(rate);
        });
    };

    useEffect(() => {
        if (!reviewId) {
            window.location.href = "/not-found";
        }

        getReview(reviewId, reviewData => {
            getUserInfoById(reviewData.authorId, updateAuthorData);
            getLeisureInfo(reviewData.leisureId, updateLeisureData);
            setReviewInfo(reviewData);
            getRelatedReviews(reviewData.id, relatedReviews => setRelatedReviews(relatedReviews));
            setTimeout(() => setIsReadOnly(true), 100);
        }, () => window.location.href = "/not-found");

        checkAccessToLikeReview(reviewId, canLike => {
            setCanLike(canLike);
        });
    }, [reviewId]);

    return (
        <>
            <Header />
            {Object.keys(reviewInfo).length !== 0 ? (
                <Container sx={{
                    my: 3
                }}
                >
                    {/* REVIEW */}
                    <Paper sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        px: 3,
                        py: 4
                    }}
                    >
                        <Box sx={{
                            display: "flex",
                            flexDirection: {
                                xs: "column-reverse",
                                sm: "row"
                            },
                            gap: 3
                        }}
                        >
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 3
                            }}
                            >
                                <Chip 
                                    label={LeisureGroupsNames[reviewInfo.group]}
                                    size="small"
                                    color="secondary"
                                />
                                <Typography>
                                    {new Date(reviewInfo.createTime).toLocaleDateString()}
                                </Typography>
                                <IconWithText
                                    text={reviewInfo.likesCount}
                                    icon={<FavoriteBorderIcon />}
                                    title={t("Review likes count")}
                                />
                            </Box>
                            {canEditReview &&
                                <Button 
                                    variant="contained" 
                                    onClick={() => window.location.href = `/review/edit/${reviewId}`}
                                    sx={{ ml: "auto" }}
                                    startIcon={<EditIcon />}
                                >
                                    {t("Edit")}
                                </Button>
                            }
                        </Box>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                        >
                            {reviewInfo.tags?.map((tag, i) =>
                                <Chip 
                                    label={tag}
                                    key={i}
                                    size="small"
                                    color="secondary"
                                />
                            )}
                        </Box>
                        <Typography variant="h3">
                            {reviewInfo.title}
                        </Typography>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 3
                        }}
                        >
                            <Typography>
                                {t("Leisure")}: <b>{leisureInfo.name}</b>
                            </Typography>
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}
                            >
                                <Rating
                                    value={userRating}
                                    onChange={ratingClickHandler}
                                />
                                <BasicTooltip title={t("Leisure rate")}>
                                    <Typography>
                                        ({leisureInfo.averageRate === 0 ? "-" : leisureInfo.averageRate}/5)
                                    </Typography>
                                </BasicTooltip>
                            </Box>
                        </Box>
                        {/* USER */}
                        <Paper sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderRadius: 10,
                            px: 4,
                            py: 1
                        }}
                        >
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}
                            >
                                <PersonIcon />
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column"
                                }}
                                >
                                    <Typography 
                                        component="a" 
                                        href={`/user/${authorInfo.name}`}
                                        sx={{ textDecoration: "none" }}
                                    >
                                        {authorInfo.name}
                                    </Typography>
                                    <Typography variant="caption">
                                        {t("Review author")}
                                    </Typography>
                                </Box>
                                <IconWithText
                                    text={authorInfo.likesCount}
                                    icon={<FavoriteBorderIcon />}
                                    title={t("User likes count")}
                                />
                            </Box>
                            <IconWithText
                                text={`${reviewInfo.authorRate}/10`}
                                icon={<SentimentSatisfiedAltIcon />}
                                title={t("Author rate")}
                            />
                        </Paper>
                        <MDXEditor
                            readOnly={isReadOnly}
                            markdown={reviewInfo.content}
                            className="readonly-mdx-editor"
                            plugins={[
                                headingsPlugin(),
                                quotePlugin(),
                                listsPlugin(),
                                thematicBreakPlugin(),
                                linkPlugin(),
                                directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
                                markdownShortcutPlugin(),
                                imagePlugin()
                            ]}
                        />
                        {isAuthenticated && canLike && 
                            <LoadingButton
                                loading={isLikeButtonLoading}
                                startIcon={<ThumbUpIcon />}
                                variant="contained"
                                sx={{ alignSelf: "center" }}
                                onClick={likeButtonClickHandler}
                            >
                                {t("Like button")}
                            </LoadingButton>
                        }
                    </Paper>
                    {/* RELATED REVIEWS */}
                    {relatedReviews.length > 0 &&
                        <Paper sx={{
                            mt: 2,
                            p: 2
                        }}
                        >
                            <Typography textAlign="center" variant="h5">
                                {t("See also")}
                            </Typography>
                            <Stack 
                                direction="row" 
                                spacing={2} 
                                sx={{ 
                                    overflowX: "auto",
                                    py: 2
                                }}
                            >
                                {relatedReviews.map((review, i) =>
                                    <ReviewCard
                                        reviewCardModel={review}
                                        key={i}
                                    />
                                )}
                            </Stack>
                        </Paper>
                    }
                    <Comments reviewId={reviewInfo.id} sx={{ mt: 2 }} />
                </Container>
            ) : (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            <Snackbar 
                open={likeSuccessAlertOpen} 
                autoHideDuration={5000} 
                onClose={() => setLikeSuccessAlertOpen(false)}
            >
                <Alert 
                    onClose={() => setLikeSuccessAlertOpen(false)} 
                    severity="success"
                >
                    {t("You have successfully liked the review!")}
                </Alert>
            </Snackbar>

            <Snackbar 
                open={signInAlertOpen} 
                autoHideDuration={5000} 
                onClose={() => setSignInAlertOpen(false)}
            >
                <Alert 
                    onClose={() => setSignInAlertOpen(false)} 
                    severity="error"
                >
                    {t("Sign in to rate leisure!")}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Review;