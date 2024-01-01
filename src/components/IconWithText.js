import { Box, Typography } from "@mui/material";

function IconWithText({ icon, text, sx }) {
    return (
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
    );
}

export default IconWithText;