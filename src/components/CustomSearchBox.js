import { TextField } from "@mui/material";
import { useRef, useState } from "react";
import { useSearchBox } from "react-instantsearch";

function CustomSearchBox(props) {
    const { query, refine } = useSearchBox(props);
    const [inputValue, setInputValue] = useState(query);
    const inputRef = useRef(null);

    const setQuery = (newQuery) => {
        setInputValue(newQuery);
        refine(newQuery);
    };

    return (
        <TextField
            ref={inputRef}
            placeholder="Search..."
            autoComplete="off"
            type="search"
            value={inputValue}
            onChange={(e) => setQuery(e.currentTarget.value)}
            autoFocus
            fullWidth
            sx={{
                pr: 2
            }}
        />
    );
}

export default CustomSearchBox;