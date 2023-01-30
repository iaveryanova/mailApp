import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { UserContext } from "../App";
import https from "../https";
import {useNavigate} from "react-router-dom";

const NavBar: React.FC = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();
  const [newMail, setNewMail] = useState(0);
  useEffect(()=>{
    getNewMailFromDatabase();

    if(context?.user) {
      const interval = setInterval(() => {
        getNewMailFromDatabase();
      }, 5000);
      return () => clearInterval(interval);
    }

  }, [context?.user])
  const getNewMailFromDatabase = async () =>{
    if(context?.user) {
      const res = await https.post('check-new-mails', {user_id: context?.user.id});
      if(res.data.new_mails){
        setNewMail(res.data.new_mails);
        return;
      }
      setNewMail(0);
    }
  }

  const logout = () => {
    context?.setUser(null);
    return navigate('/');
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Mail App</Navbar.Brand>
          {context?.user &&
              <Nav className="me-auto">
                  <Nav.Link href="#" style={ {color: '#fff' }}>
                    {context?.user.name}
                  </Nav.Link>

                  <Nav.Link onClick={() => navigate('send')}>Send message</Nav.Link>
                  <Nav.Link onClick={() => navigate('incoming')}>Incoming messages | New ({newMail})</Nav.Link>
                  <Nav.Link href="/" onClick={logout}>Logout</Nav.Link>
              </Nav>
          }
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
