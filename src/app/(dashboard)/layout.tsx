"use client";
import { PropsWithChildren, useState } from "react";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  Divider,
  Hidden,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import MuiDrawer from "@mui/material/Drawer";
import {
  AccountBalance,
  AccountCircle,
  ChevronLeft,
  Dashboard,
  Menu as MenuIcon,
  Wallet,
} from "@mui/icons-material";
import Link from "next/link";
import { AdminGuard } from "../../lib/admin-guard";
import { signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

const drawerWidth: number = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.down("md")]: {
      left: 0,
      right: 0,
      width: "100%",
      marginLeft: 0,
    },
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

function Component({ children }: PropsWithChildren<{}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorUser, setAnchorUser] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState(true);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const openUserMenu = Boolean(anchorUser);
  const menus = [
    { label: "Dashboard", href: "/", icon: <Dashboard /> },
    { label: "Finance", href: "/finance", icon: <AccountBalance /> },
    { label: "Facture", href: "/invoice", icon: <Wallet /> },
  ];
  const tabsIndex = menus.findIndex((el) => el.href === pathname);

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: "24px" }}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Dashboard
            </Typography>
            <IconButton
              color="inherit"
              id="user-menu-button"
              aria-controls={openUserMenu ? "user-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openUserMenu ? "true" : undefined}
              onClick={(e) => setAnchorUser(e.currentTarget)}
            >
              <AccountCircle />
            </IconButton>
            {anchorUser && (
              <Menu
                id="user-menu"
                anchorEl={anchorUser}
                open={open}
                onClose={() => setAnchorUser(null)}
                MenuListProps={{
                  "aria-labelledby": "user-menu-button",
                }}
              >
                <MenuItem key={"signout"} onClick={() => signOut()}>
                  Déconnexion
                </MenuItem>
              </Menu>
            )}
          </Toolbar>
        </AppBar>
        <Hidden mdDown>
          <Drawer variant="permanent" open={open}>
            <Toolbar
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                px: [1],
              }}
            >
              <IconButton onClick={toggleDrawer}>
                <ChevronLeft />
              </IconButton>
            </Toolbar>
            <Divider />
            <List component="nav">
              {menus.map((el) => (
                <Link
                  key={el.href}
                  href={el.href}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <ListItemButton>
                    <ListItemIcon>{el.icon}</ListItemIcon>
                    <ListItemText primary={el.label} />
                  </ListItemButton>
                </Link>
              ))}
            </List>
          </Drawer>
        </Hidden>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
      <Hidden mdUp>
        <Paper
          sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}
          elevation={3}
        >
          <BottomNavigation
            showLabels
            value={tabsIndex}
            onChange={(_, index) => {
              router.push(menus[index].href);
            }}
          >
            {menus.map((el) => (
              <BottomNavigationAction
                key={el.href}
                label={el.label}
                icon={el.icon}
              />
            ))}
          </BottomNavigation>
        </Paper>
      </Hidden>
    </>
  );
}

export default function Layout(props: {}) {
  return (
    <AdminGuard>
      <Component {...props} />
    </AdminGuard>
  );
}
