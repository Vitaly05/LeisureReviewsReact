import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from "@mui/material";
import IconWithText from "../components/IconWithText";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { UserStatus, UserStatusNames } from "../data/UserStatus";
import { useState } from "react";
import { changeUserStatus, makeAdmin } from "../api";
import { useTranslation } from "react-i18next";

function User({ model }) {
    const { t } = useTranslation();
    
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const [userStatus, setUserStatus] = useState(model.status);
    const [isAdmin, setIsAdmin] = useState(model.roles.includes("Admin"));

    const changeStatus = (status) => {
        changeUserStatus(model.userName, status, data => {
            setUserStatus(data);
        });
    };

    const changeRoleToAdmin = () => {
        makeAdmin(model.userName, () => {
            setIsAdmin(true);
        });
    };

    return (
        <Paper sx={{
            p: 2,
            display: "flex",
            flexDirection: {
                xs: "column",
                sm: "row"
            },
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2
        }}
        >
            <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 1
            }}
            >
                <IconWithText
                    icon={<PersonIcon />}
                    text={model.userName}
                />
                <IconWithText
                    icon={<FavoriteBorderIcon />}
                    text={model.likesCount}
                />
            </Box>
            <Box sx={{
                display: "flex",
                alignItems: "center",
                gap: 1
            }}
            >
                <Typography>
                    {t("Status")}: {UserStatusNames[userStatus]}
                </Typography>
                {isAdmin &&
                    <Typography color="error">
                        | {t("Admin")}
                    </Typography>
                }
            </Box>
            <Box>
                <Button
                    variant="contained"
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleClick}
                >
                    {t("Options")}
                </Button>
                <Menu
                    elevation={0}
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                    }}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                >
                    <Paper>
                        <MenuItem onClick={() => window.location.href = `/user/${model.userName}`} >
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            {t("Profile")}
                            
                        </MenuItem>
                        {userStatus !== UserStatus.blocked &&
                            <MenuItem onClick={() => changeStatus(UserStatus.blocked)}>
                                <ListItemIcon>
                                    <LockPersonIcon />
                                </ListItemIcon>
                                {t("Block")}
                            </MenuItem>
                        }
                        {userStatus !== UserStatus.active &&
                            <MenuItem onClick={() => changeStatus(UserStatus.active)}>
                                <ListItemIcon>
                                    <LockOpenIcon />
                                </ListItemIcon>
                                {t("Unblock")}
                            </MenuItem>
                        }
                        {!model.roles.includes("Admin") &&
                            <MenuItem onClick={changeRoleToAdmin}>
                                <ListItemIcon>
                                    <AdminPanelSettingsIcon />
                                </ListItemIcon>
                                {t("Make admin")}
                            </MenuItem>
                        }
                        <MenuItem onClick={() => changeStatus(UserStatus.deleted)}>
                            <ListItemIcon>
                                <DeleteIcon color="error" />
                            </ListItemIcon>
                            {t("Delete")}
                        </MenuItem>
                    </Paper>
                </Menu>
            </Box>
        </Paper>
    );
}

export default User;