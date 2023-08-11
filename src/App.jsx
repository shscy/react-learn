import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import MuiDrawer from '@mui/material/Drawer';

import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import List from '@mui/material/List';
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import Passwd from './Passwd.jsx'


import {
  redirect,
  useNavigate,
} from "react-router-dom";

import MainListItems from './menu.jsx';
import { loginRegister, saveUserInfo, getUserInfo } from './bridge.js'
import AddItemApp from './addItem.jsx';
import { LoginAccountApp } from './login.jsx';



// TODO remove, this demo shouldn't need to reset the theme.
const drawerWidth = 240;
const defaultTheme = createTheme();
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);



function LeftNav(onClick, toggleDrawer, open) {
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        <MainListItems onClick={onClick} />
        <Divider sx={{ my: 1 }} />
      </List>
    </Drawer>
  )
}

function SignIn() {
  const [login, setLogin] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const [account, setAccount] = React.useState("");
  const [add, setAdd] = React.useState(false);

  const navidate = useNavigate();


  function menuOnclick(eventType) {
    switch (eventType) {
      case "account":
        return function (event) {
          console.log("event account click");
        }
      case "list":
        return function (event) {
          console.log("event list click");
          setAdd(false);
        }
      case "add":
        return function (event) {
          console.log("event add click");
          setAdd(true);
        }
    }
  }

  // function loginApp() {
  //   const nav = LeftNav(menuOnclick, function () {
  //     if (open) {
  //       setOpen(false);
  //     } else {
  //       setOpen(true);
  //     }
  //   }, open);

  //   return (
  //     <ThemeProvider theme={defaultTheme}>
  //       <Box sx={{ display: 'flex' }}>
  //         {nav}
  //         <Container component="main" maxWidth="xs">
  //           <CssBaseline />
  //           <Box>
  //             <Box
  //               sx={{
  //                 marginTop: 6,
  //                 display: 'flex',
  //                 flexDirection: 'column',
  //                 alignItems: 'center',
  //               }}
  //             >
  //               <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
  //                 <LockOutlinedIcon />
  //               </Avatar>
  //               <Typography component="h2" variant="h5">
  //                 Sign in
  //               </Typography>
  //               <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
  //                 <TextField
  //                   margin="normal"
  //                   required
  //                   fullWidth
  //                   id="email"
  //                   label="google验证码"
  //                   name="email"
  //                   // autoComplete="email"
  //                   autoFocus
  //                 />
  //                 <TextField
  //                   margin="normal"
  //                   required
  //                   fullWidth
  //                   name="password"
  //                   label="密码"
  //                   type="password"
  //                   id="password"
  //                 // autoComplete="current-password"
  //                 />

  //                 <Button
  //                   type="submit"
  //                   fullWidth
  //                   variant="contained"
  //                   sx={{ mt: 3, mb: 2 }}
  //                 >
  //                   Sign In
  //                 </Button>

  //               </Box>
  //             </Box>
  //           </Box>
  //         </Container>
  //       </Box>
  //     </ThemeProvider>
  //   );
  // }

  const AddItem = () => {
    const nav = LeftNav(menuOnclick, function () {
      if (open) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }, open);


    return (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          {nav}

          <Box ntcomponent="main" maxWidth="xs" sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}>
            <CssBaseline />
            <Toolbar />
            <Container>
              <AddItemApp account={account} setAdd={setAdd}></AddItemApp>
            </Container>

          </Box>
        </Box>
      </ThemeProvider>
    )

  }

  function passwordListApp() {
    const nav = LeftNav(menuOnclick, function () {
      if (open) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }, open);

    return (
      <ThemeProvider theme={defaultTheme}>
        <Box sx={{ display: 'flex' }}>
          {nav}

          <Box ntcomponent="main" maxWidth="xs" sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}>
            <CssBaseline />
            <Toolbar />
            <Container>
              <Passwd account={account}></Passwd>
            </Container>

          </Box>
        </Box>
      </ThemeProvider>
    )
  }
  console.log("is login ", login)
  if (login) {
    if (add) {
      return AddItem()
    } else {
      return passwordListApp();
    }
  }
  return (
    <LoginAccountApp setLogin={setLogin} setAccountInfo={setAccount}>

    </LoginAccountApp>
  )
}


export default SignIn