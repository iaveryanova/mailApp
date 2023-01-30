import React, {useContext, useState} from 'react'
import { Route, Routes } from 'react-router-dom'
import {UserContext} from "../App";
import {Navigate}  from "react-router-dom";
import {LoginPage} from "../pages/login-page";
import {SendMessagesPage} from "../pages/send-messages-page";
import {IncomingMessagesPage} from "../pages/incoming-messages-page";


const AppRoutes = () => {
    const context = useContext(UserContext);
    return (
          <Routes>
            {!context?.user &&
                <>
                  <Route path="/" element={<LoginPage />} />
                  <Route
                      path="*"
                      element={<Navigate to="/" replace/>}
                  />
                </>
            }
            {context?.user &&
                <>
                    <Route path="send" element={<SendMessagesPage />} />
                    <Route path="incoming" element={<IncomingMessagesPage />} />
                    <Route
                        path="*"
                        element={<Navigate to="send" replace/>}
                    />
                </>
            }
          </Routes>
    );
}

export default AppRoutes


