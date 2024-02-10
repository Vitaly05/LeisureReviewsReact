import { Box, Typography } from "@mui/material";
import IconLink from "./IconLink";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import EmailIcon from "@mui/icons-material/Email";

function Footer() {
    return (
        <Box 
            bgcolor="primary.main"
            className="footer"
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mt: 2,
                p: 2,
                gap: 2,
                flexShrink: 0
            }}
        >
            <Box sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 2
            }}
            >
                <IconLink href="https://github.com/Vitaly05" icon={<GitHubIcon sx={{ color: "primary.contrastText" }} />} />
                <IconLink href="https://www.linkedin.com/in/vitaly-loziuk-388279259/?locale=en_US" icon={<LinkedInIcon sx={{ color: "primary.contrastText" }} />} />
                <IconLink href="https://t.me/vitalySharp" icon={<TelegramIcon sx={{ color: "primary.contrastText" }} />} />
                <IconLink href="mailto:vitalik050405@gmail.com" icon={<EmailIcon sx={{ color: "primary.contrastText" }} />} />
            </Box>
            <Typography color="primary.contrastText">
                2024 Created by Vitaly Loziuk
            </Typography>
        </Box>
    );
}

export default Footer;