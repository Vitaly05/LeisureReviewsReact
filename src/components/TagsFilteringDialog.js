import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TagsInput } from "react-tag-input-component";

function TagsFilteringDialog({ initValues, open, onClose, onApply }) {
    const { t } = useTranslation();

    const maxTagsCount = 5;

    const [tags, setTags] = useState([]);
    const [validationMessage, setValidationMessage] = useState("");

    const tagsValidator = (tag, tags) => {
        setValidationMessage("");
        if (tags.length >= maxTagsCount) {
            setValidationMessage(t("Max tags count is {{maxCount}}", { maxCount: maxTagsCount }));
            return false;
        }
        return true;
    };

    const resetClickHandler = () => {
        setTags([]);
        onApply([]);
    };

    const applyClickHandler = () => {
        onApply(tags);
    };

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullWidth
            maxWidth="sm"
        >
            <DialogTitle>
                {t("Tags filtering")}
            </DialogTitle>
            <DialogContent dividers>
                <FormControl fullWidth>
                    <TagsInput
                        placeHolder={t("Tags")}
                        id="tags"
                        name="tags"
                        value={initValues}
                        onChange={(tags) => setTags(tags)}
                        beforeAddValidate={tagsValidator}
                    />
                    <FormHelperText error>
                        {validationMessage}
                    </FormHelperText>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button 
                    sx={{
                        mr: "auto"
                    }}
                    onClick={resetClickHandler}
                >
                    {t("Reset")}
                </Button>
                <Button 
                    variant="contained"
                    onClick={applyClickHandler}
                >
                    {t("Apply")}
                </Button>
                <Button 
                    variant="outlined"
                    onClick={() => onClose()}
                >
                    {t("Cancel")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default TagsFilteringDialog;