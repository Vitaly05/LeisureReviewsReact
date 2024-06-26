import { Box, Button, Chip, IconButton, LinearProgress, Paper, Typography } from "@mui/material";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import IconWithText from "./IconWithText";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { useEffect, useState } from "react";
import { getLeisureInfo } from "../api";
import { LeisureGroupsNames } from "../data/LeisureGroups";
import { useTranslation } from "react-i18next";
import BasicTooltip from "./BasicTooltip";

function ReviewCard({ reviewCardModel, canEdit, onDelete }) {
    const { t } = useTranslation();

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
        <Paper
            sx={{
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
                    label={t(LeisureGroupsNames[reviewCardModel.group])} 
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
                        <Typography variant="body2">{t("Leisure")}:</Typography>
                        {leisureInfo.isLoading ? 
                            <LinearProgress sx={{ 
                                width: 100,
                                ml: 2
                            }} 
                            />
                        : (
                            <>
                                <Typography variant="body2" sx={{ ml: "4px" }}>
                                    <b>{leisureInfo.name}</b>
                                </Typography>
                                <IconWithText
                                    icon={<StarOutlineIcon />}
                                    text={`${leisureInfo.averageRate === 0 ? "-" : leisureInfo.averageRate}/5`}
                                    title={t("Leisure rate")}
                                    sx={{ ml: 2 }}
                                />
                            </>
                        )}
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
                            title={t("Author rate")}
                        />
                        <IconWithText
                            icon={<FavoriteBorderIcon />}
                            text={reviewCardModel.likesCount}
                            title={t("Review likes count")}
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
                                {t("Edit")}
                            </Button>
                            <BasicTooltip title={t("View review")}>
                                <IconButton onClick={handleReadButtonClick}>
                                    <VisibilityIcon />
                                </IconButton>
                            </BasicTooltip>
                        </Box>
                        <BasicTooltip title={t("Delete review")}>
                            <IconButton color="error" onClick={handleDeleteButtonClick}>
                                <DeleteIcon />
                            </IconButton>
                        </BasicTooltip>
                    </Box>
                ) : (
                    <Button 
                        variant="contained"
                        onClick={handleReadButtonClick}
                        sx={{ mt: 2 }}
                    >
                        {t("Read")}
                    </Button>
                )}
            </Box>
        </Paper>
    );
}

export default ReviewCard;