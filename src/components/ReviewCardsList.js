import { Box, CircularProgress, Typography } from "@mui/material";
import ReviewCard from "./ReviewCard";

function ReviewCardsList({ sx, reviewCards, isLoading }) {
    const Content = () => {
        if (isLoading) {
            return <CircularProgress />;
        } 
        if (reviewCards.length < 1) {
            return (
                <Typography>
                    There are no reviews
                </Typography>
            );
        } else {
            return reviewCards.map((card, i) =>
                <ReviewCard reviewCardModel={card} key={i} />
            );
        }
    };

    return (
        <Box
            sx={{
                ...sx,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
            }}
        >
            <Content />
        </Box>
    );
}

export default ReviewCardsList;