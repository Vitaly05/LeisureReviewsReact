import { LoadingButton, TabContext, TabList, TabPanel } from "@mui/lab";
import Header from "../components/Header";
import { Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogTitle, FormControl, FormHelperText, InputLabel, MenuItem, Select, Snackbar, Tab, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { LeisureGroups } from "../data/LeisureGroups";
import { TagsInput } from "react-tag-input-component";
import { AdmonitionDirectiveDescriptor, BlockTypeSelect, BoldItalicUnderlineToggles, CreateLink, InsertAdmonition, InsertThematicBreak, ListsToggle, MDXEditor, Separator, UndoRedo, directivesPlugin, headingsPlugin, linkDialogPlugin, linkPlugin, listsPlugin, markdownShortcutPlugin, quotePlugin, thematicBreakPlugin, toolbarPlugin } from "@mdxeditor/editor";
import { getLeisureInfo, getReview, saveReview } from "../api";
import { useParams } from "react-router-dom";

const validationSchema = Yup.object({
    title: Yup.string().required().max(255),
    leisureName: Yup.string().required(),
    group: Yup.number().required().moreThan(0),
    authorRate: Yup.number().required().min(0).max(10),
    content: Yup.string().required()
});

function EditReview() {
    const { authorId, reviewId } = useParams();

    const [tabValue, setTabValue] = useState("main");
    const handleTabChange = (e, val) => {
        setTabValue(val);
    };

    const [reviewInfoIsLoading, setReviewInfoIsLoading] = useState(false);
    const [saveButtonIsLoading, setSaveButtonIsLoading] = useState(false);

    const [reviewInfo, setReviewInfo] = useState({
        id: "",
        authorId: authorId,
        title: "",
        leisureName: "",
        tagsNames: [],
        group: undefined,
        authorRate: undefined,
        content: ""
    });

    const [errors, setErrors] = useState({});

    const handleFieldChange = (field, value) => {
        setReviewInfo(prevState => ({
            ...prevState,
            [field]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(reviewInfo)
        try {
            await validationSchema.validate(reviewInfo, {
                abortEarly: false
            });
            setErrors({});

            setSaveButtonIsLoading(true);
            saveReview(reviewInfo, (reviewId) => {
                setSaveButtonIsLoading(false);
                setReviewInfo(prevState => ({
                    ...prevState,
                    id: reviewId
                }));
                showSuccessDialog();
            }, () => setErrorAlertOpen(true));
        } catch (err) {
            if (err.name !== "ValidationError") return;
            const newErrors = {};
            err.inner.forEach(error => {
                newErrors[error.path] = error.message;
            });
            setErrors(newErrors);
        }
    };

    const [successDialogOpen, setSuccessDialogOpen] = useState(false);

    const showSuccessDialog = () => {
        setSuccessDialogOpen(true);
    };

    const closeSuccessDialog = () => {
        setSuccessDialogOpen(false);
        window.location.href = `/review/edit/${reviewInfo.id}`;
    };

    const [errorAlertOpen, setErrorAlertOpen] = useState(false);

    useEffect(() => {
        if (reviewId) {
            setReviewInfoIsLoading(true);
            getReview(reviewId, reviewInfo => {
                getLeisureInfo(reviewInfo.leisureId, leisureInfo => {
                    setReviewInfo({
                        id: reviewInfo.id,
                        authorId: reviewInfo.authorId,
                        title: reviewInfo.title,
                        leisureName: leisureInfo.name,
                        tagsNames: reviewInfo.tags,
                        group: reviewInfo.group,
                        authorRate: reviewInfo.authorRate,
                        content: reviewInfo.content
                    });
                    setReviewInfoIsLoading(false);
                });
            });
        }
    }, []);


    return (
        <>
            <Header />
            <Container>
                <Box sx={{ mt: 2 }}>
                {reviewInfoIsLoading ? (
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>

                ) : (
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                            <TabList 
                                onChange={handleTabChange}
                                variant="fullWidth"
                            >
                                <Tab label="Main Info" value="main" />
                                <Tab label="Content" value="content" />
                            </TabList>
                        </Box>
                        <form onSubmit={handleSubmit}>
                            <TabPanel value="main">
                                <Box sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    gap: 3
                                }}
                                >
                                    <FormControl fullWidth>
                                        <TextField
                                            autoComplete="off"
                                            label="Title"
                                            id="title"
                                            name="title"
                                            value={reviewInfo.title}
                                            onChange={(e) => handleFieldChange("title", e.target.value)}
                                            error={!!errors.title}
                                        />
                                        <FormHelperText error={!!errors.title}>
                                            {errors.title}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TextField
                                            autoComplete="off"
                                            label="Leisure"
                                            id="leisure"
                                            name="leisure"
                                            value={reviewInfo.leisureName}
                                            onChange={(e) => handleFieldChange("leisureName", e.target.value)}
                                            error={!!errors.leisureName}
                                        />
                                        <FormHelperText error={!!errors.leisureName}>
                                            {errors.leisureName}
                                        </FormHelperText>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <TagsInput
                                            placeHolder="Tags"
                                            id="tags"
                                            name="tags"
                                            value={reviewInfo.tagsNames}
                                            onChange={(tags) => handleFieldChange("tagsNames", tags)}
                                        />
                                    </FormControl>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: {
                                            xs: "column",
                                            sm: "row"
                                        },
                                        gap: {
                                            xs: 2,
                                            sm: 4
                                        },
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                    >
                                        <Box sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        >
                                            <FormControl>
                                                <InputLabel id="group-label">Group</InputLabel>
                                                <Select 
                                                    labelId="group-label"
                                                    label="Group"
                                                    sx={{ width: 100 }}
                                                    name="group"
                                                    value={reviewInfo.group}
                                                    onChange={(e) => handleFieldChange("group", e.target.value)}
                                                    error={!!errors.group}
                                                >
                                                    <MenuItem value={0} disabled>
                                                        Group
                                                    </MenuItem>
                                                    {LeisureGroups.map(group => 
                                                        <MenuItem key={group.id} value={group.id}>
                                                            {group.name}
                                                        </MenuItem>
                                                    )}
                                                </Select>
                                            </FormControl>
                                            <FormHelperText error={!!errors.group} sx={{ textAlign: "center" }}>
                                                {errors.group}
                                            </FormHelperText>
                                        </Box>
                                        <FormControl sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                        >
                                            <TextField
                                                sx={{ width: 100 }}
                                                inputProps={{ sx: { textAlign: "center" } }}
                                                autoComplete="off"
                                                label="Rate"
                                                id="rate"
                                                name="rate"
                                                value={reviewInfo.authorRate}
                                                onChange={(e) => handleFieldChange("authorRate", e.target.value)}
                                                error={!!errors.authorRate}
                                            />
                                            <FormHelperText error={!!errors.authorRate} sx={{ textAlign: "center" }}>
                                                {errors.authorRate}
                                            </FormHelperText>
                                        </FormControl>
                                    </Box>
                                </Box>
                            </TabPanel>
                            <TabPanel value="content">
                                <FormControl fullWidth>
                                    <MDXEditor
                                        markdown={reviewInfo.content}
                                        onChange={(val) => handleFieldChange("content", val)}
                                        contentEditableClassName="markdown-editor-content"
                                        plugins={[
                                            toolbarPlugin({
                                                toolbarContents: () => (
                                                    <>
                                                        <BoldItalicUnderlineToggles />
                                                        <Separator />
                                                        <BlockTypeSelect />
                                                        <Separator />
                                                        <ListsToggle />
                                                        <Separator />
                                                        <InsertAdmonition />
                                                        <InsertThematicBreak />
                                                        <Separator />
                                                        <CreateLink />
                                                        <Box sx={{
                                                            display: {
                                                                xs: "block",
                                                                md: "none"
                                                            }
                                                        }}
                                                        >
                                                            <Separator />
                                                        </Box>
                                                        <Box sx={{ ml: "auto"}}>
                                                            <UndoRedo />
                                                        </Box>
                                                    </>
                                                )
                                            }),
                                            headingsPlugin(),
                                            quotePlugin(),
                                            listsPlugin(),
                                            thematicBreakPlugin(),
                                            linkPlugin(),
                                            linkDialogPlugin(),
                                            directivesPlugin({ directiveDescriptors: [AdmonitionDirectiveDescriptor] }),
                                            markdownShortcutPlugin()
                                        ]}
                                    />
                                    <FormHelperText error={!!errors.content}>
                                        {errors.content}
                                    </FormHelperText>
                                </FormControl>
                            </TabPanel>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: 1,
                                mt: 2
                            }}
                            >
                                <LoadingButton
                                    loading={saveButtonIsLoading}
                                    variant="contained"
                                    type="submit"
                                    onClick={handleSubmit}
                                >
                                    Save
                                </LoadingButton>
                                {Object.keys(errors).length > 0 &&
                                    <FormHelperText error>
                                        Validation error
                                    </FormHelperText>
                                }
                            </Box>
                        </form>
                    </TabContext>
                )}
                </Box>
            </Container>

            <Dialog onClose={closeSuccessDialog} open={successDialogOpen}>
                <DialogTitle>The review has been successfully saved!</DialogTitle>
                <DialogActions>
                    <Button href="/" variant="contained">Go to home</Button>
                    <Button onClick={closeSuccessDialog} variant="outlined">Continue editing</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={errorAlertOpen}
                onClose={() => setErrorAlertOpen(false)}
                autoHideDuration={10000}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="error" onClick={() => setErrorAlertOpen(false)}>Error occured</Alert>
            </Snackbar>
        </>
    );
}

export default EditReview;