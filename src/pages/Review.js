import { useParams } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import { checkAccessToLikeReview, getLeisureInfo, getRate, getRelatedReviews, getReview, getUserInfoById, likeReview, rateLeisure } from "../api";
import { LeisureGroupsNames } from "../data/LeisureGroups";
import { Alert, Box, Chip, CircularProgress, Container, Paper, Rating, Snackbar, Stack, TextField, Typography } from "@mui/material";
import IconWithText from "../components/IconWithText";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import PersonIcon from "@mui/icons-material/Person";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SendIcon from "@mui/icons-material/Send";
import { AdmonitionDirectiveDescriptor, MDXEditor, directivesPlugin, headingsPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin } from "@mdxeditor/editor";
import ReviewCard from "../components/ReviewCard";
import * as signalR from "@microsoft/signalr";
import Comment from "../components/Comment";
import { useSelector } from "react-redux";
import { LoadingButton } from "@mui/lab";

// eslint-disable-next-line no-undef
const signalRHubUrl = process.env.NODE_ENV === "development" ? "/hub" : `${process.env.REACT_APP_API_HOST}/hub`;

function Review() {
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

    const [userRating, setUserRating] = useState(0);

    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [comments, setComments] = useState([]);
    const [commentText, setCommentText] = useState("");
    const [isCommentButtonLoading, setIsCommentButtonLoading] = useState(false);

    const [connection, setConnection] = useState(null);

    const sendComment = async () => {
        if (commentText.length > 0) {
            setIsCommentButtonLoading(true);
            await connection.invoke("send", commentText, reviewInfo.id);
            setCommentText("");
            setIsCommentButtonLoading(false);
        }
    };

    const likeButtonClickHandler = () => {
        setIsLikeButtonLoading(true);

        likeReview(reviewInfo.id, () => {
            setReviewInfo(prevState => ({
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
        setUserRating(newValue);
        rateLeisure(leisureInfo.id, newValue, newAvgRate => {
            setLeisureInfo(prevState => ({
                ...prevState,
                averageRate: newAvgRate
            }));
        });
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
        if (!reviewId) return;

        getReview(reviewId, reviewData => {
            getUserInfoById(reviewData.authorId, updateAuthorData);
            getLeisureInfo(reviewData.leisureId, updateLeisureData);
            setReviewInfo(reviewData);
            getRelatedReviews(reviewData.id, relatedReviews => setRelatedReviews(relatedReviews));
            setTimeout(() => setIsReadOnly(true), 100);
        });

        checkAccessToLikeReview(reviewId, canLike => {
            setCanLike(canLike);
        });
    }, [reviewId]);

    useEffect(() => {
        const initConnection = async () => {
            if (connection) return;

            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${signalRHubUrl}/comments`)
                .configureLogging(signalR.LogLevel.Information)
                .build();
    
            newConnection.on("new-comment", (comment) => {
                setComments(prevState => {
                    if (prevState.every(c => c.id !== comment.id)) {
                        return [comment, ...prevState];
                    }
                    return prevState;
                });
            });
    
            newConnection.on("init-comments", (comments) => {
                setComments(comments);
            });
    
            newConnection.onclose(() => setConnection(null));
    
            await newConnection.start();
            await newConnection.invoke("init", reviewInfo.id);
            setIsCommentsLoading(false);
    
            if (reviewInfo.id) {
                setConnection(newConnection);
            }
        };
        
        initConnection();
    }, [reviewInfo]);

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
                            />
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
                                Leisure: <b>{leisureInfo.name}</b>
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
                                <Typography>
                                    ({leisureInfo.averageRate === 0 ? "-" : leisureInfo.averageRate}/5)
                                </Typography>
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
                                        Review author
                                    </Typography>
                                </Box>
                                <IconWithText
                                    text={authorInfo.likesCount}
                                    icon={<FavoriteBorderIcon />}
                                />
                            </Box>
                            <IconWithText
                                text={`${reviewInfo.authorRate}/10`}
                                icon={<SentimentSatisfiedAltIcon />}
                            />
                        </Paper>
                        <MDXEditor
                            readOnly={isReadOnly}
                            markdown={reviewInfo.content}
                            plugins={[
                                headingsPlugin(),
                                quotePlugin(),
                                listsPlugin(),
                                thematicBreakPlugin(),
                                linkPlugin(),
                                directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
                                markdownShortcutPlugin()
                            ]}
                        />
                        {canLike && 
                            <LoadingButton
                                loading={isLikeButtonLoading}
                                startIcon={<ThumbUpIcon />}
                                variant="contained"
                                sx={{ alignSelf: "center" }}
                                onClick={likeButtonClickHandler}
                            >
                                Like
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
                                See also
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
                    {/* COMMENTS */}
                    <Paper sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        mt: 2,
                        p: 2
                    }}
                    >
                        <Typography variant="h5" textAlign="center">
                            Comments
                        </Typography>
                        {isAuthenticated ? (
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}
                            >
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Write your comment"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <LoadingButton
                                    loading={isCommentButtonLoading}
                                    startIcon={<SendIcon />}
                                    onClick={sendComment}
                                    variant="contained"
                                >
                                    Send
                                </LoadingButton>
                            </Box>
                        ) : (
                            <Box sx={{ display: "flex", justifyContent: "center", gap: 1}}>
                                <Typography component="a" href="/sign-in">
                                    Sign in
                                </Typography>
                                <Typography textAlign="center">
                                    to write a comment
                                </Typography>
                            </Box>
                        )}
                        {isCommentsLoading ? (
                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            comments.length > 0 ? (
                                <Stack spacing={2}>
                                    {comments.map((comment) => 
                                        <Comment model={comment} key={comment.id} />
                                    )}
                                </Stack>
                            ) : (
                                <Typography textAlign="center">
                                    There are no comments
                                </Typography>
                            )
                        )}
                    </Paper>
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
                    You have successfully liked the review!
                </Alert>
            </Snackbar>
        </>
    );
}

export default Review;