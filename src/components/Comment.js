import { Box, Divider, IconButton, Paper, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getCurrentUserCommentRate, getUserInfo } from "../api";
import IconWithText from "./IconWithText";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

function Comment({ model, onRate }) {
    const { t } = useTranslation();

    const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

    const [authorInfo, setAuthorInfo] = useState({
        username: "",
        likesCount: 0,
        isLoading: true
    });

    const [isLoading, setIsLoading] = useState(true);
    const [currentUserRate, setCurrentUserRate] = useState(model.currentUserRateStatus);

    const likeClickHandler = () => {
        if (model.currentUserRateStatus === true || !isAuthenticated || isLoading)
            return;
        onRate(true, model.id);
        setCurrentUserRate(true);
    };

    const dislikeClickHandler = () => {
        if (model.currentUserRateStatus === false || !isAuthenticated || isLoading)
            return;
        onRate(false, model.id);
        setCurrentUserRate(false);
    };


    useEffect(() => {
        if (!isAuthenticated) {
            setCurrentUserRate(null);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        getUserInfo(model.authorName, userInfo => {
            setAuthorInfo({
                username: userInfo.userName,
                likesCount: userInfo.likesCount,
                isLoading: false
            });
        });
        getCurrentUserCommentRate(model.id, rate => {
            if (rate === null) return;
            setCurrentUserRate(rate);
        }, () => {
            setIsLoading(false);
        });
    }, []);


    return (
        <Paper sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2
        }}
        >
            <Box sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}
            >
                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2
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
                        {authorInfo.isLoading ? (
                            <Skeleton width={100} />
                        ) : (
                        <>
                            <Typography 
                                textTransform="none"
                                component="a"
                                href={`/user/${authorInfo.username}`}
                            >
                                {authorInfo.username}
                            </Typography>
                        </>
                        )}
                    </Box>
                    <IconWithText
                        icon={<FavoriteBorderIcon />}
                        text={
                            authorInfo.isLoading ? (
                                <Skeleton width={30} />
                            ) : (
                                authorInfo.likesCount
                            )
                        }
                        title={t("User likes count")}
                    />
                </Box>
                <Typography variant="body2">
                    {new Date(model.createTime).toLocaleString()}
                </Typography>
            </Box>
            <Divider />
            <Typography>
                {model.text}
            </Typography>
            <Divider />
            <Box sx={{
                display: "flex",
                justifyContent: "end",
                gap: 2
            }}
            >
                <IconWithText 
                    icon={
                        <IconButton 
                            onClick={likeClickHandler}
                            sx={{
                                color: theme => currentUserRate === true ? theme.palette.secondary.main : "transparent",
                                stroke: theme => theme.palette.secondary.main,
                                strokeWidth: 1
                            }}
                        >
                            <ThumbUpIcon />
                        </IconButton>
                    }
                    text={model.likesCount}
                    title={t("Like comment")}
                />
                <IconWithText
                    icon={
                        <IconButton 
                            onClick={dislikeClickHandler}
                            sx={{
                                color: theme => currentUserRate === false ? theme.palette.primary.main : "transparent",
                                stroke: theme => theme.palette.primary.main,
                                strokeWidth: 1
                            }}
                        >
                            <ThumbDownIcon />
                        </IconButton>
                    }
                    text={model.dislikesCount}
                    title={t("Dislike comment")}
                />
            </Box>
        </Paper>
    );
}

export default Comment;