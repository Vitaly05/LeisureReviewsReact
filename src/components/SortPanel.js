import { IconButton, Paper, Typography } from "@mui/material";
import { SortTarget, SortType } from "../data/SortParams";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

function SortPanel({ sortTarget, activeSortTarget, activeSortType, onClick }) {
    const { t } = useTranslation();

    const [isActive, setIsActive] = useState(false);
    const [descendingButtonColor, setDescendingButtonColor] = useState("");
    const [ascendingButtonColor, setAscendingButtonColor] = useState("");

    const getSortTargetString = () => {
        switch (sortTarget) {
            case SortTarget.date:
                return t("Date");
            case SortTarget.rate:
                return t("Rate");
            case SortTarget.likes:
                return t("Likes");
            default:
                return "-";
        }
    };

    const setSortTypeButtonsColor = () => {
        if (!isActive) return;

        if (activeSortType === SortType.descending) {
            setDescendingButtonColor("inherit");
            setAscendingButtonColor("");
        } else if (activeSortType === SortType.ascending) {
            setDescendingButtonColor("");
            setAscendingButtonColor("inherit");
        }
    };

    useEffect(() => {
        setSortTypeButtonsColor();
    }, [isActive]);

    useEffect(() => {
        if (activeSortTarget === sortTarget) {
            setIsActive(true);
        } else {
            setIsActive(false);
        }
    }, [activeSortTarget, activeSortType]);


    return (
        <Paper sx={{
            p: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            minWidth: 200
        }}
        >
            <IconButton 
                onClick={() => onClick(sortTarget, SortType.descending)}
                color={descendingButtonColor}
            >
                <ArrowDownwardIcon />
            </IconButton>
            <Typography variant="body1">
                <b>{getSortTargetString()}</b>
            </Typography>
            <IconButton 
                onClick={() => onClick(sortTarget, SortType.ascending)}
                color={ascendingButtonColor}
            >
                <ArrowUpwardIcon />
            </IconButton>
        </Paper>
    );
}

export default SortPanel;