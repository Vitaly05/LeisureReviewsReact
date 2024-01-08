import { Box, Button, Card, Chip, LinearProgress, Typography } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import IconWithText from "./IconWithText";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { getLeisureInfo } from "../api";
import { LeisureGroupsNames } from "../data/LeisureGroups";


const backgroundColor = grey[50];


function ReviewCard({ reviewCardModel }) {
    const [leisureInfo, setLeisureInfo] = useState({
        name: "",
        averageRate: undefined,
        isLoading: true
    });

    useEffect(() => {
        setLeisureInfo(prevState => ({
            ...prevState,
            isLoading: true
    }));
        getLeisureInfo(reviewCardModel.leisureId, (info) => {
            setLeisureInfo({
                name: info.name,
                averageRate: info.averageRate,
                isLoading: false
            });
        });
    }, [reviewCardModel]);

    return (
        <Card
            sx={{
                width: {
                    xs: 300,
                    sm: 500,
                    md: 700
                },
                backgroundColor: backgroundColor
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    p: 3
                }}
            >
                <Chip 
                    label={LeisureGroupsNames[reviewCardModel.group]} 
                    color="secondary"
                    size="small"
                    sx={{
                        alignSelf: "end",
                        width: 100
                    }}
                />
                <Typography variant="h5">
                    {reviewCardModel.title}
                </Typography>
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    mt: 2
                }}
                >
                    <Box sx={{
                        display: "flex",
                        alignItems: "center"
                    }}
                    >
                        <Typography variant="body2">Leisure:</Typography>
                        {leisureInfo.isLoading ? 
                            <LinearProgress sx={{ 
                                width: 100,
                                ml: 2
                            }} 
                            />
                        :
                        <>
                            <Typography variant="body2" sx={{ ml: "4px" }}>
                                <b>{leisureInfo.name}</b>
                            </Typography>
                            <IconWithText
                                icon={<StarOutlineIcon />}
                                text={`${leisureInfo.averageRate === 0 ? "-" : leisureInfo.averageRate}/10`}
                                sx={{ ml: 2 }}
                            />
                        </>
                        }
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}
                    >
                        {reviewCardModel.tags.map((tag, i) =>
                            <Chip 
                                label={tag}
                                key={i}
                                size="small"
                                color="secondary"
                            />
                        )}
                    </Box>
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2
                    }}
                    >
                        <IconWithText
                            icon={<SentimentSatisfiedAltIcon />}
                            text={`${reviewCardModel.authorRate}/10`}
                        />
                        <IconWithText
                            icon={<FavoriteBorderIcon />}
                            text={reviewCardModel.likesCount}
                        />
                    </Box>
                </Box>
                <Button 
                    variant="contained"
                    sx={{ mt: 2 }}
                >
                    Read
                </Button>
            </Box>
        </Card>
    );
}

export default ReviewCard;