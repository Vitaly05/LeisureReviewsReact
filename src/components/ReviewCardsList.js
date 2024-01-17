import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography } from "@mui/material";
import ReviewCard from "./ReviewCard";
import { useState } from "react";
import { deleteReview } from "../api";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";

function ReviewCardsList({ sx, reviewCards, isLoading, canEdit, updateListMethod }) {
    const { t } = useTranslation();

    const [deleteReviewModel, setDeleteReviewModel] = useState({});
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
    const [isDeleteButtonLoading, setIsDeleteButtonLoading] = useState(false);
    const [isErrorAlertOpen, setIsErrorAlertOpen] = useState(false);

    const handleDeleteButton = () => {
        setIsDeleteButtonLoading(true);
        deleteReview(deleteReviewModel.id, () => {
            updateListMethod();
            setDeleteConfirmationOpen(false);
        }, () => {
            setIsErrorAlertOpen(true);
        }, () => {
            setIsDeleteButtonLoading(false);
            setDeleteConfirmationOpen(false);
        });
    };

    const deleteReviewHandler = (reviewCardModel) => {
        setDeleteReviewModel(reviewCardModel);
        setDeleteConfirmationOpen(true);
    };

    
    const Content = () => {
        if (isLoading) {
            return <CircularProgress />;
        } 
        if (reviewCards.length < 1) {
            return (
                <Typography>
                    {t("There are no reviews")}
                </Typography>
            );
        } else {
            return reviewCards.map((card, i) =>
                <ReviewCard 
                    key={i} 
                    reviewCardModel={card} 
                    canEdit={canEdit} 
                    onDelete={deleteReviewHandler} 
                />
            );
        }
    };

    return (
        <>
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

            <Dialog 
                open={deleteConfirmationOpen} 
                onClose={() => setDeleteConfirmationOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {t("Are you sure you want to delete the review?")}
                </DialogTitle>
                <DialogContent dividers sx={{ display: "flex", justifyContent: "center" }}>
                    <ReviewCard reviewCardModel={deleteReviewModel} canEdit={false} />
                </DialogContent>
                <DialogActions>
                    <Button 
                        autoFocus
                        variant="outlined"
                        onClick={() => setDeleteConfirmationOpen(false)}
                    >
                        {t("Cancel")}
                    </Button>
                    <LoadingButton
                        loading={isDeleteButtonLoading}
                        variant="contained"
                        onClick={handleDeleteButton}
                    >
                        {t("Ok")}
                    </LoadingButton>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={isErrorAlertOpen} 
                autoHideDuration={5000} 
                onClose={() => setIsErrorAlertOpen(false)}
            >
                <Alert 
                    severity="error"
                    onClose={() => setIsErrorAlertOpen(false)}
                >
                    {t("Failed to delete the review")}
                </Alert>
            </Snackbar>
        </>
    );
}

export default ReviewCardsList;