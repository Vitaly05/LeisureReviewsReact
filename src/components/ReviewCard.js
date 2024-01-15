import { Box, Button, Card, Chip, IconButton, LinearProgress, Typography } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import IconWithText from "./IconWithText";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { grey } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { getLeisureInfo } from "../api";
import { LeisureGroupsNames } from "../data/LeisureGroups";


const backgroundColor = grey[50];


function ReviewCard({ reviewCardModel, canEdit, onDelete }) {
    const [leisureInfo, setLeisureInfo] = useState({
        name: "",
        averageRate: undefined,
        isLoading: true
    });

    const handleDeleteButtonClick = () => {
        onDelete(reviewCardModel);
    };

    const handleReadButtonClick = () => {
        window.location.href = `/review/${reviewCardModel.id}`;
    };

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
                minWidth: {
                    xs: 300,
                    sm: 500,
                },
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
                    justifyContent: "space-between",
                    height: "100%",
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
                {canEdit ? (
                    <Box sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 2
                    }}
                    >
                        <Box sx={{ 
                            display: "flex",
                            alignItems: "center",
                            gap: 2
                        }}
                        >
                            <Button variant="contained" onClick={() => window.location.href = `/review/edit/${reviewCardModel.id}`}>
                                Edit
                            </Button>
                            <IconButton onClick={handleReadButtonClick}>
                                <VisibilityIcon />
                            </IconButton>
                        </Box>
                        <IconButton color="error" onClick={handleDeleteButtonClick}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                ) : (
                    <Button 
                        variant="contained"
                        onClick={handleReadButtonClick}
                        sx={{ mt: 2 }}
                    >
                        Read
                    </Button>
                )}
            </Box>
        </Card>
    );
}

export default ReviewCard;