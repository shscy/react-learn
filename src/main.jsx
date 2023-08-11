import React from 'react'
import ReactDOM from 'react-dom/client'
import SignIn from './App.jsx'
import Passwd from './Passwd.jsx'
import Dashboard from './Dash.jsx'
import {LoginAccountApp} from './login.jsx';
import {NewUserApp} from './NewUser.jsx';

import {
    createBrowserRouter,
    RouterProvider,
  } from "react-router-dom";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <SignIn/>,
    },
    {
        path: "/newUser",
        element: <NewUserApp/>
    },
  ]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
     <RouterProvider router={router} />
  </React.StrictMode>,
)
