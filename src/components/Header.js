import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../api";
import { useSelector } from "react-redux";
import SearchPanel from "./SearchPanel";
import i18n from "../i18n";
import { t } from "i18next";

function Header() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [currentUser, setCurrentUser] = useState({});

    const [anchorEl, setAnchorEl] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const showUserDropdownMenu = (e) => {
        setAnchorEl(e.currentTarget);
        setUserDropdownOpen(true);
    };

    const hideUserDropdownMenu = () => {
        setUserDropdownOpen(false);
    };

    const handleCreateReviewButton = () => {
        window.location.href = `/review/new/${currentUser.id}`;
    };

    const toggleLanguage = () => {
        const newLanguage = i18n.language === "en" ? "ru" : "en";
        i18n.changeLanguage(newLanguage);
        window.localStorage.setItem("lang", newLanguage);
    };

    const signInClickHandler = () => {
        navigate(`/sign-in?return-url=${window.location.pathname}`)
    };

    const signUpClickHandler = () => {
        navigate(`/sign-up?return-url=${window.location.pathname}`)
    };


    useEffect(() => {
        if (isAuthenticated) {
            setCurrentUser(JSON.parse(sessionStorage.getItem("currentUser")));
        }
    }, [isAuthenticated]);

    const DrawerMenuContent = () => {
        return (
            <List sx={{ width: 250 }}>
                <ListItem disablePadding>
                    <ListItemButton onClick={toggleDrawer}>
                        <ListItemIcon>
                            <CloseIcon />
                        </ListItemIcon>
                    </ListItemButton>
                </ListItem>
                {isAuthenticated ?
                <>
                    <ListItem>
                        <Box sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1
                        }}
                        >
                            <PersonIcon />
                            <Typography textTransform="none">
                                {currentUser.username}
                            </Typography>
                        </Box>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton 
                            href={`/user/${currentUser.username}`} 
                            component="a"
                        >
                            <ListItemIcon>
                                <AccountBoxIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {t("Profile")}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleCreateReviewButton}>
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {t("Create review")}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem
                        disablePadding  
                        variant="contained"
                        color="error"
                        onClick={signOut}
                    >
                        <ListItemButton>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {t("Sign Out")}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                </>
                :
                <>
                    <ListItem disablePadding>
                        <ListItemButton onClick={signInClickHandler}>
                            <ListItemText>
                                {t("Sign In")}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={signUpClickHandler}>
                            <ListItemText>
                                {t("Sign Up")}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                </>
                }
                <Divider />
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => setIsSearchDialogOpen(true)}>
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {t("Search")}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => toggleLanguage()}>
                            <ListItemIcon>
                                <LanguageIcon />
                            </ListItemIcon>
                            <ListItemText>
                                {i18n.language === "en" ? "Russian" : "English"}
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
            </List>
        );
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography 
                            variant="h6"
                            component="a"
                            href="/"
                            sx={{
                                mr: "auto",
                                color: "inherit",
                                textDecoration: "none",
                            }}
                        >
                            Leisure Reviews
                        </Typography>
                        <Box
                            sx={{
                                display: {
                                    xs: "none",
                                    sm: "inherit"
                                },
                                alignItems: "center"
                            }}
                        >
                            <Box sx={{ mr: 3 }}>
                                <IconButton
                                    size="large"
                                    color="inherit"
                                    aria-label="search"
                                    onClick={() => setIsSearchDialogOpen(true)}
                                >
                                    <SearchIcon />
                                </IconButton>
                                <Button
                                    onClick={() => toggleLanguage()}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<LanguageIcon />}
                                >
                                    {i18n.language === "en" ? "ru" : "en"}
                                </Button>
                            </Box>
                            {isAuthenticated ?
                            <>
                                <Button 
                                    variant="text"
                                    color="inherit"
                                    onClick={showUserDropdownMenu}
                                >
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1
                                    }}
                                    >
                                        <PersonIcon />
                                        <Typography textTransform="none">
                                            {currentUser.username}
                                        </Typography>
                                        <ArrowDropDownIcon />
                                    </Box>
                                </Button>
                                <Menu
                                    anchorEl={anchorEl}
                                    open={userDropdownOpen}
                                    onClose={hideUserDropdownMenu}
                                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                                >
                                    <MenuItem 
                                        href={`/user/${currentUser.username}`} 
                                        component="a"
                                    >
                                        <ListItemIcon>
                                            <AccountBoxIcon />
                                        </ListItemIcon>
                                        {t("Profile")}
                                    </MenuItem>
                                    <MenuItem onClick={handleCreateReviewButton}>
                                        <ListItemIcon>
                                            <AddIcon />
                                        </ListItemIcon>
                                        <ListItemText>
                                            {t("Create review")}
                                        </ListItemText>
                                    </MenuItem>
                                    <Divider />
                                    <MenuItem
                                        variant="contained"
                                        color="error"
                                        onClick={signOut}
                                    >
                                        <ListItemIcon>
                                            <LogoutIcon />
                                        </ListItemIcon>
                                        {t("Sign Out")}
                                    </MenuItem>
                                </Menu>
                            </>
                            :
                                <Box>
                                    <Button 
                                        color="inherit"
                                        onClick={signInClickHandler}
                                    >
                                        {t("Sign In")}
                                    </Button>
                                    <Button 
                                        color="inherit"
                                        onClick={signUpClickHandler}
                                    >
                                        {t("Sign Up")}
                                    </Button>
                                </Box>
                            }
                        </Box>
                        <IconButton
                            size="large"
                            color="inherit"
                            aria-label="menu"
                            sx={{
                                display: {
                                    xs: "flex",
                                    sm: "none"
                                }
                            }}
                            onClick={toggleDrawer}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="right"
                            open={drawerOpen}
                            onClose={toggleDrawer}
                        >
                            <DrawerMenuContent />
                        </Drawer>
                    </Toolbar>
                </AppBar>
            </Box>
            
            <SearchPanel 
                open={isSearchDialogOpen} 
                onClose={() => setIsSearchDialogOpen(false)}
            />
        </>
    );
}

export default Header;