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

import { loginRegister, saveUserInfo, getUserInfo, AddPasswordItem} from './bridge.js'


export default function AddItemApp(props) {
    const setAdd = props.setAdd;

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        // console.log({
        //   email: data.get('email'),
        //   password: data.get('password'),
        // });
        let uuid = data.get("uuid")
        let name = data.get("name");
        let passwd = data.get("password");
        let mark = data.get("mark");
        AddPasswordItem(props.account, {
            uuid: uuid,
            name: name,
            password: passwd,
            mark: mark,
        }, () => {
            setAdd(false);
        })
    }

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="uuid"
                label="唯一标识符"
                name="uuid"
                // autoComplete="email"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="名称"
                name="name"
                autoFocus
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="密码"
                type="password"
                id="password"
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="mark"
                label="备注"
                id="mark"
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                新增
            </Button>

        </Box>
    )
}