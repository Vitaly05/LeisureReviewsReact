import { Button, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getTagsWeights } from "../api";
import { TagCloud } from "react-tagcloud";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import BasicTooltip from "./BasicTooltip";

function TagsCloud({ open, onClose, onTagClick }) {
    const { t } = useTranslation();

    const [tags, setTags] = useState([]);

    const tagClickHandler = (tag) => {
        onTagClick(tag.value);
    };

    useEffect(() => {
        getTagsWeights((data) => {
            setTags(data.map(tag => ({
                value: tag.text,
                count: tag.weight
            })));
        });
    }, []);

    const tagRenderer = (tag, size, color) => {
        return (
            <BasicTooltip title={t("The number of reviews that use this tag: {{count}}. Click to see them", { count: tag.count })} >
                <Button 
                    size="small"
                    sx={{
                        mx: 1
                    }}
                >
                    <Typography 
                        fontSize={size}
                        key={tag.value}
                        component="a"
                        style={{ color }}
                    >
                        {tag.value}
                    </Typography>
                </Button>
            </BasicTooltip>
        );
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
        >
            <IconButton 
                onClick={onClose}
                sx={{ position: "absolute", right: 0, zIndex: 2 }}
            >
                <CloseIcon />
            </IconButton> 
            <DialogTitle>
                {t("Tags Cloud")}
            </DialogTitle>
            <DialogContent 
                dividers
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <TagCloud
                    minSize={20}
                    maxSize={60}
                    tags={tags}
                    style={{ textAlign: "center" }}
                    disableRandomColor
                    renderer={tagRenderer}
                    onClick={tagClickHandler}
                />
            </DialogContent>
        </Dialog>
    );
}

export default TagsCloud;