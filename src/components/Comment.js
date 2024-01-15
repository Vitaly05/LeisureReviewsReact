import { Box, Divider, Paper, Skeleton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserInfo } from "../api";
import IconWithText from "./IconWithText";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function Comment({ model }) {
    const [authorInfo, setAuthorInfo] = useState({
        username: "",
        likesCount: 0,
        isLoading: true
    });

    useEffect(() => {
        getUserInfo(model.authorName, userInfo => {
            setAuthorInfo({
                username: userInfo.userName,
                likesCount: userInfo.likesCount,
                isLoading: false
            });
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
        </Paper>
    );
}

export default Comment;