import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TelegramIcon from "@mui/icons-material/Telegram";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import IconLink from "./IconLink";

function Footer() {
    const { t } = useTranslation();

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
                <IconLink 
                    href="https://github.com/Vitaly05" 
                    icon={<GitHubIcon sx={{ color: "primary.contrastText" }} />}
                    title={t("My GitHub")}
                />
                <IconLink 
                    href="https://www.linkedin.com/in/vitaly-loziuk-388279259/?locale=en_US" 
                    icon={<LinkedInIcon sx={{ color: "primary.contrastText" }} />} 
                    title={t("My LinkedIn")}
                />
                <IconLink 
                    href="https://t.me/vitaly_loziuk" 
                    icon={<TelegramIcon sx={{ color: "primary.contrastText" }} />} 
                    title={t("My Telegram")}
                />
                <IconLink 
                    href="mailto:vitalik050405@gmail.com" 
                    icon={<EmailIcon sx={{ color: "primary.contrastText" }} />} 
                    title={t("My Email")}
                />
            </Box>
            <Typography color="primary.contrastText">
                2024 Created by Vitaly Loziuk
            </Typography>
        </Box>
    );
}

export default Footer;