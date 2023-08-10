import * as React from 'react';
import { useEffect } from 'react';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import TextField from '@mui/material/TextField';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

// import { invoke } from '@tauri-apps/api/tauri';
import { loginRegister, saveUserInfo, getUserInfo } from './bridge.js'


import { createTheme, ThemeProvider } from '@mui/material/styles';
import { TireRepair } from '@mui/icons-material';


const defaultTheme = createTheme();

function NewPasswd() {
   function newPasswdItem(event) {
      console.log("newpassItem");
   }
   return (
      <Grid container sx={{ marginBottom: 3 }}>
         <Grid item xs>
            <Button variant="outlined" onClick={newPasswdItem}>新建</Button>
         </Grid>
         <Grid item>
            <Link href="#" variant="body2">
               {"哈哈啊哈哈"}
            </Link>
         </Grid>
      </Grid>
   );
}

function PassItems(props) {
   const editItem = props.editItem;
   const deleteItem = props.deleteItem;
   const rows = props.rows;

   return (
      <Box sx={{ width: '100%' }}>
         <Paper sx={{ width: '100%', mb: 2 }}>
            <TableContainer>
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell align="center">名称</TableCell>
                        <TableCell align="center">密码</TableCell>
                        <TableCell align="center">备注</TableCell>
                        <TableCell align="center">编辑</TableCell>
                        <TableCell align="center">删除</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     {rows.map((row) => (
                        <TableRow
                           key={row.name}
                           sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                           <TableCell component="th" scope="row">
                              {row.name}
                           </TableCell>
                           <TableCell align="center">{row.passwd}</TableCell>
                           <TableCell align="center">{row.mark}</TableCell>
                           <TableCell padding="checkbox">
                              <Button variant="outlined" onClick={editItem(row.uuid)}>编辑</Button>
                           </TableCell>
                           <TableCell padding="checkbox">
                              <Button variant="outlined" onClick={deleteItem(row.uuid)}>删除</Button>
                           </TableCell>
                        </TableRow>
                     ))}
                  </TableBody>
               </Table>
            </TableContainer>
         </Paper>
      </Box>
   );
}

function createData(uuid, name, passwd, mark) {
   return { uuid, name, passwd, mark }
}

const rows_1 = [
   createData("0", 'Frozen yoghurt', 159, 6.0, 24),
   createData("1", 'Ice cream sandwich', 237, 9.0, 37),
   createData("2", 'Eclair', 262, 16.0, 24),
   createData("3", 'Cupcake', 305, 3.7, 67),
   createData("4", 'Gingerbread', 356, 16.0, 49),
];

export default function Passwd(props) {
   const [appState, setAppState] = React.useState({
      rows: [],
      open: false,
      select: {},
      update: {
         name: "",
         passwd: "",
      },
      isEdit: false,
   });
   const account = props.account;

   useEffect(() => {
      // invoke rust code 
      // setRows(null);
      // invoke('get_passwd').then(data=>{
      //    console.log("rust data resoonse ", data.items);
      //    setRows(data.items);
      // });
      getUserInfo(account, (r_rows)=>{
         setAppState(pre => ({
            ...pre,
            rows: r_rows,
         }));
      })
      console.log("user effect");
      return () => {
         console.log("user effect stop");
      };
   }, [account]);

   function editItem(uuid) {
      return function (event) {
         console.log("edit uuid ", uuid)
         let select = {}
         appState.rows.every(ele => {
            if (ele.uuid == uuid) {
               select = {
                  uuid: uuid,
                  name: ele.name,
                  passwd: ele.passwd,
               }
               return false;
            } else {
               return true;
            }
         });
         console.log("edit ", select);

         setAppState(pre => ({
            ...pre,
            open: true,
            select: select,
         }));
         // setOpen(true);
      }
   }

   function deleteItem(uuid) {
      return function (event) {
         console.log("delete uuid ", uuid)
         let new_rows = appState.rows.filter(ele => {
            return ele.uuid != uuid;
         });
         setAppState(pre => ({
            ...pre,
            isEdit: true,
            rows: new_rows,
         }));
      }
   }

   function handleClose(){
      setAppState(pre => ({
         ...pre,
         open: false,
      }));
   }

   function confirmSubmit() {
      let rows = appState.rows;
      // todo save to db
   }

   function handleConfirm() {
      console.log("handelr confirm", appState.update);
      let isUpdate = false;
      let update = appState.update;

      let new_rows = appState.rows.map(ele => {
         if (ele.uuid == appState.select.uuid) {
            if (update.name != "" && ele.name != update.name) {
               ele.name = update.name;
               isUpdate = true;
            }
            if (update.passwd != "" && ele.passwd != update.passwd) {
               ele.passwd = update.passwd;
               isUpdate = true;
            }
            return ele;
         }
         return ele;
      });

      setAppState(pre => ({
         ...pre,
         open: false,
         rows: new_rows,
         isEdit: isUpdate,
         update: {
            name:"",
            passwd:"",
         },
         select: {
         }
      }));
   }


   return (
      <Box maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
         {/* <NewPasswd /> */}
         <PassItems
            editItem={editItem} deleteItem={deleteItem} rows={appState.rows}>
         </PassItems>
         {appState.isEdit && <Button variant="outlined" onClick={confirmSubmit}>
            是否提交变更
         </Button>}

         <Dialog open={appState.open} onClose={handleClose}>
            <DialogTitle>Subscribe</DialogTitle>
            <DialogContent>
               <DialogContentText>
                  To subscribe to this website, please enter your email address here. We
                  will send updates occasionally.
               </DialogContentText>
               <TextField
                  autoFocus
                  margin="dense"
                  id="name"
                  label="name"
                  type="normal"
                  fullWidth
                  variant="standard"
                  defaultValue={appState.select.name}
                  onChange={ele => {
                     setAppState(pre => ({
                        ...pre,
                        update: {
                           ...pre.update,
                           name: ele.target.value,
                        },
                     }));
                  }}
               />
               <TextField
                  autoFocus
                  margin="dense"
                  id="passwd"
                  label="passwd"
                  type="normal"
                  fullWidth
                  variant="standard"
                  defaultValue={appState.select.passwd}
                  onChange={ele => {
                     setAppState(pre => ({
                        ...pre,
                        update: {
                           ...pre.update,
                           passwd: ele.target.value,
                        },
                     }));
                  }}
               />
            </DialogContent>
            <DialogActions>
               <Button onClick={handleClose}>Cancel</Button>
               <Button onClick={handleConfirm}>Subscribe</Button>
            </DialogActions>
         </Dialog>
      </Box>
   )
   // return (
   //    <ThemeProvider theme={defaultTheme}>
   //       <Container component="main" maxWidth="xs">
   //          <CssBaseline />
   //          <Box
   //             sx={{
   //                marginTop: 10,
   //                display: 'flex',
   //                flexDirection: 'column',
   //                alignItems: 'center',
   //             }}
   //          >
   //             <NewPasswd />
   //             <PassItems
   //                editItem={editItem} deleteItem={deleteItem} rows={rows}>
   //             </PassItems>
   //          </Box>
   //       </Container>
   //    </ThemeProvider>
   // );
}