import { Box, Typography } from "@mui/material";
import BasicTooltip from "./BasicTooltip";

function IconWithText({ icon, text, title, sx }) {
    return (
        <BasicTooltip title={title}>
            <Box sx={{
                ...sx,
                display: "flex",
                alignItems: "center"
            }}
            >
                {icon}
                <Typography 
                    variant="body2"
                    sx={{ ml: "2px" }}
                >
                    {text}
                </Typography>
            </Box>
        </BasicTooltip>
    );
}

export default IconWithText;