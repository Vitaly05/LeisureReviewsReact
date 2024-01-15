import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from "@mui/material";
import algoliasearch from "algoliasearch/lite";
import { InfiniteHits, InstantSearch, PoweredBy } from "react-instantsearch";
import CustomSearchBox from "./CustomSearchBox";
import CustomSearchHit from "./CustomSearchHit";
import CloseIcon from "@mui/icons-material/Close";

// eslint-disable-next-line no-undef
const searchClient = algoliasearch(process.env.REACT_APP_ALGOLIA_APP_ID, process.env.REACT_APP_ALGOLIA_API_KEY);

function SearchPanel({ open, onClose }) {
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            fullScreen
            scroll="paper"
        >
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: "absolute",
                    right: 0,
                    top: 0
                }}
            >
                <CloseIcon />
            </IconButton>
            <InstantSearch
                searchClient={searchClient}
                indexName="reviews"
            >
                <DialogTitle>
                    <CustomSearchBox />
                </DialogTitle>
                <DialogContent dividers>
                    <InfiniteHits 
                        hitComponent={CustomSearchHit} 
                        showPrevious={false}
                        classNames={{
                            loadMore: "css-lll1vm-MuiButtonBase-root-MuiButton-root width-100"
                        }}
                    />
                </DialogContent>
                <DialogActions sx={{
                    justifyContent: "center",
                }}
                >
                    <PoweredBy style={{ width: 200 }} />
                </DialogActions>
            </InstantSearch>
        </Dialog>
    );
}

export default SearchPanel;