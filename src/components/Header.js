import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ModeNightIcon from "@mui/icons-material/ModeNight";
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

function Header() {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [currentUser, setCurrentUser] = useState({});

    const [anchorEl, setAnchorEl] = useState(null);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);

    const navigate = useNavigate();
    const [drawerOpen, setDrawerOpen] = useState(false);

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
                                Profile
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/review/new")}>
                            <ListItemIcon>
                                <AddIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Create Review
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
                                Sign Out
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                </>
                :
                <>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/sign-in")}>
                            <ListItemText>
                                Sign In
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate("/sign-up")}>
                            <ListItemText>
                                Sign Up
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                </>
                }
                <Divider />
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <SearchIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Search
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <ListItemIcon>
                                <ModeNightIcon />
                            </ListItemIcon>
                            <ListItemText>
                                Dark mode
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
            </List>
        );
    };

    return (
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
                            >
                                <SearchIcon />
                            </IconButton>
                            <IconButton
                                size="large"
                                color="inherit"
                                aria-label="night mode"
                            >
                                <ModeNightIcon />
                            </IconButton>
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
                                    Profile
                                </MenuItem>
                                <MenuItem onClick={() => navigate("/review/new")}>
                                    <ListItemIcon>
                                        <AddIcon />
                                    </ListItemIcon>
                                    <ListItemText>
                                        Create Review
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
                                    Sign Out
                                </MenuItem>
                            </Menu>
                        </>
                        :
                            <Box>
                                <Button 
                                    color="inherit"
                                    onClick={() => navigate("/sign-in")}
                                >
                                    Sign In
                                </Button>
                                <Button 
                                    color="inherit"
                                    onClick={() => navigate("/sign-up")}
                                >
                                    Sign Up
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
    );
}

export default Header;