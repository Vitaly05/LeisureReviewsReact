import { LoadingButton } from "@mui/lab";
import { Box, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SendIcon from "@mui/icons-material/Send";

function SendCommentForm({ sendCommentHandler }) {
    const { t } = useTranslation();

    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    const [commentText, setCommentText] = useState("");
    const [isCommentButtonLoading, setIsCommentButtonLoading] = useState(false);

    const sendComment = async () => {
        if (commentText.length > 0) {
            setIsCommentButtonLoading(true);
            await sendCommentHandler(commentText);
            setCommentText("");
            setIsCommentButtonLoading(false);
        }
    };

    if (isAuthenticated) {
        return (
            <Box sx={{
                display: "flex",
                flexDirection: {
                    xs: "column",
                    md: "row"
                },
                alignItems: "center",
                gap: 1
            }}
            >
                <TextField
                    fullWidth
                    size="small"
                    label={t("Write your comment")}
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                />
                <LoadingButton
                    loading={isCommentButtonLoading}
                    startIcon={<SendIcon />}
                    onClick={sendComment}
                    variant="contained"
                >
                    {t("Send")}
                </LoadingButton>
            </Box>
        );
    } else {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1}}>
                <Typography component="a" href={`/sign-in?return-url=${window.location.pathname}`}>
                    {t("Sign in 2")}
                    
                </Typography>
                <Typography textAlign="center">
                    {t("to write a comment")}
                </Typography>
            </Box>
        );
    }
}

export default SendCommentForm;