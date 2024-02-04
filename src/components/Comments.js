import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import Comment from "./Comment";
import SendCommentForm from "./SendCommentForm";

// eslint-disable-next-line no-undef
const signalRHubUrl = process.env.NODE_ENV === "development" ? "/hub" : `${process.env.REACT_APP_API_HOST}/hub`;

function Comments({ sx, reviewId }) {
    const { t } = useTranslation();

    const [isCommentsLoading, setIsCommentsLoading] = useState(true);
    const [comments, setComments] = useState([]);

    const [connection, setConnection] = useState(null);

    const onSendComment = async (commentText) => {
        await connection.invoke("send", commentText, reviewId);
    };

    useEffect(() => {
        const initConnection = async () => {
            if (connection) return;

            const accessToken = window.localStorage.getItem("accessToken");

            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${signalRHubUrl}/comments`, {
                    accessTokenFactory: () => accessToken
                })
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
            await newConnection.invoke("init", reviewId);
            setIsCommentsLoading(false);
    
            if (reviewId) {
                setConnection(newConnection);
            }
        };
        
        initConnection();
    }, [reviewId]);

    return (
        <Paper sx={{
            ...sx,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            p: 2
        }}
        >
            <Typography variant="h5" textAlign="center">
                {t("Comments")}
            </Typography>
            <SendCommentForm sendCommentHandler={onSendComment} />
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
                        {t("There are no comments")}
                    </Typography>
                )
            )}
        </Paper>
    );
}

export default Comments;