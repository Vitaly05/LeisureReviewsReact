import { AppBar, Box, Button, Divider, Drawer, FormControl, IconButton, InputLabel, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Select, Toolbar, Typography } from "@mui/material";
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
import BasicTooltip from "./BasicTooltip";

function Header() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [currentUser, setCurrentUser] = useState({});

    const [anchorEl, setAnchorEl] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

    const [language, setLanguage] = useState(i18n.language);

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

    const languageChangeHandler = (e) => {
        const newLanguage = e.target.value;
        setLanguage(newLanguage);
        i18n.changeLanguage(newLanguage);
        window.localStorage.setItem("lang", newLanguage);
    };

    const signInClickHandler = () => {
        navigate(`/sign-in?return-url=${window.location.pathname}`);
    };

    const signUpClickHandler = () => {
        navigate(`/sign-up?return-url=${window.location.pathname}`);
    };


    useEffect(() => {
        if (isAuthenticated) {
            hideUserDropdownMenu();
            const curUser = sessionStorage.getItem("currentUser");
            if (curUser) {
                setCurrentUser(JSON.parse(curUser));
            }
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
                        <FormControl 
                            fullWidth
                            sx={{ m: 2 }}
                        >
                            <InputLabel id="language-select-label">{t("Language")}</InputLabel>
                            <Select
                                labelId="language-select-label"
                                label={t("Language")}
                                value={language}
                                onChange={languageChangeHandler}
                                IconComponent={() =>
                                    <LanguageIcon sx={{ mr: 1 }} />
                                }
                            >
                                <MenuItem value="en">En</MenuItem>
                                <MenuItem value="ru">Рус</MenuItem>
                                <MenuItem value="be">Бел</MenuItem>
                            </Select>
                        </FormControl>
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
                            <Box sx={{ 
                                mr: 3,
                                display: "flex",
                                alignItems: "center",
                                gap: 1
                            }}
                            >
                                <BasicTooltip title={t("Search")}>
                                    <IconButton
                                        size="large"
                                        color="inherit"
                                        aria-label="search"
                                        onClick={() => setIsSearchDialogOpen(true)}
                                    >
                                        <SearchIcon />
                                    </IconButton>
                                </BasicTooltip>
                                <FormControl>
                                    <InputLabel 
                                        id="language-select-label"
                                        sx={{
                                            color: theme => theme.palette.primary.contrastText,
                                            "&.Mui-focused": {
                                                color: theme => theme.palette.primary.contrastText,
                                            }
                                        }}
                                    >
                                        {t("Language")}
                                    </InputLabel>
                                    <Select
                                        labelId="language-select-label"
                                        label={t("Language")}
                                        value={language}
                                        size="small"
                                        onChange={languageChangeHandler}
                                        IconComponent={() =>
                                            <LanguageIcon sx={{ mr: 1 }} />
                                        }
                                        sx={{
                                            backgroundColor: theme => theme.palette.secondary.main,
                                            color: theme => theme.palette.primary.contrastText,
                                            "&.Mui-focused": {
                                                borderStyle: "solid",
                                                borderWidth: 1,
                                                borderColor: theme => theme.palette.secondary.main,
                                            },
                                            "& .MuiOutlinedInput-notchedOutline": {
                                                borderColor: theme => theme.palette.secondary.main,
                                            }
                                        }}
                                    >
                                        <MenuItem value="en">En</MenuItem>
                                        <MenuItem value="ru">Рус</MenuItem>
                                        <MenuItem value="be">Бел</MenuItem>
                                    </Select>
                                </FormControl>
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