import { Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Highlight } from "react-instantsearch";

function CustomSearchHit({ hit }) {
    const { t } = useTranslation();

    return (
        <Paper 
            sx={{
                m: 1,
                p: 2
            }}
            className="search-review-result"
            onClick={() => window.location.href = `/review/${hit.objectID}`}
        >
            <Typography variant="h5">
                <Highlight 
                    attribute="title" 
                    hit={hit} 
                    classNames={{
                        highlighted: "highlighted-search-hit"
                    }}
                />
            </Typography>
            <Typography variant="body2">
                {`${t("Leisure")}: `}
                <b>
                    <Highlight 
                        attribute="leisure" 
                        hit={hit}
                        classNames={{
                            highlighted: "highlighted-search-hit"
                        }}
                    />
                </b>
            </Typography>
        </Paper>
    );
}

export default CustomSearchHit;