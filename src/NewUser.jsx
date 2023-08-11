
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
import { loginRegister } from './bridge';
import {
    useNavigate,
  } from "react-router-dom";


const defaultTheme = createTheme();

export function NewUserApp() {
    const navidate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        let account = data.get("account");
        let passwd = data.get("password");
        await loginRegister(account, passwd);
        navidate("/");
    }

    const textAppF = () => {

    }
    const textApp = textAppF();

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box sx={{ display: 'flex' }}>
                <Container component="main" maxWidth="xs">
                    <CssBaseline />
                    <Box>
                        <Box
                            sx={{
                                marginTop: 6,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                            component='form'
                            onSubmit={handleSubmit}
                        >
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h2" variant="h5">
                                注册新用户
                            </Typography>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="account"
                                label="账号"
                                name="account"
                                // onChange={handleChange}
                                // autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="password"
                                label="密码"
                                type="password"
                                name="password"
                                autoFocus
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, mb: 2 }}
                            >
                                提交
                            </Button>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>)
}