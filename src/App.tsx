import React, {useContext, useEffect, useState} from "react";
import { LoginPage } from "./pages/login-page/login-page";
import { IncomingMessagesPage } from "./pages/incoming-messages-page/incoming-messages-page";
import { SendMessagesPage } from "./pages/send-messages-page";
import {BrowserRouter, Navigate, Route, Routes, useNavigate} from "react-router-dom";
import NavBar from "./components/NavBar";
import AppRoutes from "./components/AppRoutes";


export interface UserContextType {
  user: IUser | null ;
  setUser: (user: IUser | null) => void;
}

export interface IUser {
  id: number;
  name: string;
}

export const UserContext = React.createContext<UserContextType | null>(null);


export const App: React.FC = () => {
  // let initUser = localStorage.user ? JSON.parse(localStorage.user) : null;
  let initUser = null;
  const [user, setUser] = useState<IUser | null>(initUser);

  // useEffect(()=>{
  //   if(localStorage.user){
  //     setUser(JSON.parse(localStorage.user));
  //   }
  // },[localStorage])


  return (
    <UserContext.Provider value={{user:user, setUser:setUser}}>
      <BrowserRouter>
        <NavBar />
        <AppRoutes />
      </BrowserRouter>
    </UserContext.Provider>
    
  );
}

export default App;
