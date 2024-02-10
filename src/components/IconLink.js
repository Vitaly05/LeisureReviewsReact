import { IconButton } from "@mui/material";

function IconLink({ href, icon }) {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            <IconButton sx={{
                borderStyle: "solid",
                borderColor: "primary.contrastText",
                borderWidth: "1px"
            }}
            >
                {icon}
            </IconButton>
        </a>
    );
}

export default IconLink;