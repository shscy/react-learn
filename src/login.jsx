
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


const defaultTheme = createTheme();
const verifyAccountIsExists = (account) => {
    return [true, ""]
    // if (account == "zxlscy") {
    //     return [true, ""]
    // }
    // return [false, "账号不存在"]
}
const verifyAccountPassword = (account, password) => {

    if (account == "zxlscy" && password == "123") {
        return [true, ""]
    }
    return [false, "密码不正确请重试"]
}

export function LoginAccountApp(props) {
    const [formData, setFormData] = React.useState({});
    const [step, setSetp] = React.useState("stepAccount");
    const [err, setError] = React.useState({
        error: false,
        reason: "",
    })

    const handleAccountNext = (evnet) => {
        const account = formData.account;
        console.log("handlerNext account ", account);

        const [ok, reason] = verifyAccountIsExists(account);
        if (ok) {
            setSetp("stepPassword");
            setError({
                error: false,
            })

        } else {
            setError({
                error: true,
                reason: reason,
            })
        }
    }

    const handlePasswordNext = (evnet) => {
        const password = formData.password;
        const account = formData.account;
        loginRegister(account, password, () => {
            setError({
                error: false,
            })
            props.setLogin(true);
            props.setAccountInfo(account);
            setFormData({})
        }, () => {
            const reason = "密码错误请重试";
            setError({
                error: true,
                reason: reason,
            })
        })
        // console.log("handlerNext account ", formData.account, formData.password);
        // const [ok, reason] = verifyAccountPassword(account, password);
        // if (ok) {
        //     // setSetp("stepPassword");
        //     setError({
        //         error: false,
        //     })
        //     props.setLogin(true);
        //     props.setAccountInfo(account);
        //     setFormData({})
        // } else {
        //     setError({
        //         error: true,
        //         reason: reason,
        //     })
        // }
    }

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });

    }
    const accountTextApp = () => {
        if (!err.error) {
            return <TextField
                margin="normal"
                required
                fullWidth
                id="account"
                label="账号"
                name="account"
                onChange={handleChange}
                // autoComplete="email"
                autoFocus
            />
        } else {
            return <TextField
                error
                margin="normal"
                id="outlined-error-helper-text"
                required
                fullWidth
                label="账号"
                name="account"
                onChange={handleChange}
                helperText="找不到你的账号"
                autoFocus
            />
        }
    }
    const stepAccount = () => {
        console.log("stepaccount ");
        const textApp = accountTextApp();
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
                            >
                                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                    <LockOutlinedIcon />
                                </Avatar>
                                <Typography component="h2" variant="h5">
                                    登录
                                </Typography>
                                {textApp}
                                <Box ></Box>
                                <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                                    <Grid item xs={3} >
                                        <Button
                                            type="submit"
                                            sx={{ mt: 2, mb: 2 }}
                                        >
                                            创建账号
                                        </Button>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={handleAccountNext}
                                            sx={{ mt: 2, mb: 2 }}
                                        >
                                            下一步
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </ThemeProvider>
        );
    }

    const stepPassword = () => {
        const textApp = () => {
            if (!err.error) {
                return <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="password"
                    label="密码"
                    name="password"
                    onChange={handleChange}
                    // autoComplete="email"
                    autoFocus
                />
            } else {
                return <TextField
                    error
                    margin="normal"
                    id="password"
                    required
                    fullWidth
                    label="Miami"
                    name="password"
                    onChange={handleChange}
                    helperText="密码错误，请重试"
                    autoFocus
                />
            }
        }

        const text = textApp();
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
                            >
                                {/* <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <LockOutlinedIcon />
                            </Avatar> */}
                                <Typography component="h2" variant="h5">
                                    欢迎{formData.account}
                                </Typography>
                                {text}
                                <Box ></Box>
                                <Grid container justifyContent="space-between" sx={{ marginTop: 2 }}>
                                    <Grid item xs={3} >
                                        <Button
                                            type="submit"
                                            // fullWidth
                                            // variant="contained"
                                            sx={{ mt: 2, mb: 2 }}
                                        >
                                            忘记密码?
                                        </Button>
                                    </Grid>
                                    <Grid item xs={3}>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            onClick={handlePasswordNext}
                                            sx={{ mt: 2, mb: 2 }}
                                        >
                                            下一步
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </ThemeProvider>
        )
    }



    const curentApp = () => {
        switch (step) {
            case "stepAccount":
                return stepAccount();
            case "stepPassword":
                return stepPassword();
        }
    }

    let app = curentApp();
    return app
}