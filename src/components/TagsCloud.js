import { Button, Dialog, DialogContent, DialogTitle, IconButton, Tooltip, Typography, Zoom, tooltipClasses } from "@mui/material";
import { useEffect, useState } from "react";
import { getTagsWeights } from "../api";
import { TagCloud } from "react-tagcloud";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

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

    const TagTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.arrow}`]: {
            color: "#161B1D",
        },
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: "#161B1D",
            maxWidth: 200
        },
    }));

    const tagRenderer = (tag, size, color) => {
        return (
            <TagTooltip 
                title={t("The number of reviews that use this tag: {{count}}. Click to see them", { count: tag.count })} 
                TransitionComponent={Zoom}
                placement="top" 
                arrow
            >
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
            </TagTooltip>
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