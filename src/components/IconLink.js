import { IconButton } from "@mui/material";
import BasicTooltip from "./BasicTooltip";

function IconLink({ href, icon, title }) {
    return (
        <a href={href} target="_blank" rel="noreferrer">
            <BasicTooltip title={title}>
                <IconButton sx={{
                    borderStyle: "solid",
                    borderColor: "primary.contrastText",
                    borderWidth: "1px"
                }}
                >
                    {icon}
                </IconButton>
            </BasicTooltip>
        </a>
    );
}

export default IconLink;