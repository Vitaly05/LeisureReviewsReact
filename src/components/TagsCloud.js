import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { getTagsWeights } from "../api";
import { TagCloud } from "react-tagcloud";
import CloseIcon from "@mui/icons-material/Close";

function TagsCloud({ open, onClose }) {
    const [tags, setTags] = useState([]);
    useEffect(() => {
        getTagsWeights((data) => {
            setTags(data.map(tag => ({
                value: tag.text,
                count: tag.weight
            })));
        });
    }, []);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen
        >
            <IconButton 
                onClick={onClose}
                sx={{ position: "absolute", right: 0 }}
            >
                <CloseIcon />
            </IconButton> 
            <DialogTitle>
                Tags Cloud
            </DialogTitle>
            <DialogContent dividers>
                <TagCloud
                    minSize={20}
                    maxSize={40}
                    tags={tags}
                />
            </DialogContent>
        </Dialog>
    );
}

export default TagsCloud;