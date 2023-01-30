import React, { useContext, useEffect, useState } from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { IUser } from "../App";
import https from "../https";
import { UserContext } from "../App";
// import { MailsContext } from "../pages/incoming-messages-page";
import { IMail } from '../pages/send-messages-page/send-messages-page';

const IncomingMessagesTable: React.FC = () => {
  // const mailsContext = useContext(MailsContext);
  const context = useContext(UserContext);

  const [mails, setMails] = useState<IMail[] | null>(null);
  useEffect(() => {
    if(context?.user){
        getIncomingMails(context?.user);
      const interval = setInterval(() => {
        getIncomingMails(context?.user);
      }, 5000);
      return () => clearInterval(interval);
        // checkIncomingMailEveryFiveSec();
    }
}, [context?.user]);

  const getIncomingMails = async (userTo: IUser | null) => {
    try {
      if (userTo) {
        const res = await https.post("incoming-mails", {
          to_user_id: userTo.id,
        });

        setMails(res.data);
        return res.data;
      }
    } catch (e) {
      console.log(e);
    }
    return null;
  };


  const readMail = async (id: number) => {
    const res = await https.post("read-mail", {
      id: id,
    });
  }

  const [expanded, setExpanded] = React.useState<number | false>(false);
  const handleChange =
    (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      readMail(panel);

      setExpanded(isExpanded ? panel : false);
    };
  return (
    <div>
        <AccordionSummary aria-controls="panel1bh-content" id="pane-header">
          <Typography sx={{ width: "33%", color: "text.secondary"}}>Data</Typography>
          <Typography sx={{ width: "33%", color: "text.secondary"}}>
            From
          </Typography>
          <Typography sx={{ width: "33%", color: "text.secondary" }}>
            Title Message
          </Typography>
        </AccordionSummary>



{mails &&
    <>
    {mails.map((mail) => (
        <Accordion
        expanded={expanded === mail.id}
        onChange={handleChange(mail.id)}
        key={mail.id+'-acc-key'}
        id={mail.id+'-acc-id'}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          key={mail.id+'-acc-summ-key'}
          id={mail.id+'-acc-summ-id'}
        >
          <Typography sx={
            mail.is_read === 0 ? { width: "33%", fontWeight: "bold"} : {width: "33%"}
          }>
            {mail.created_at}
          </Typography>
          <Typography sx={mail.is_read === 0 ? { width: "33%", fontWeight: "bold"} : {width: "33%" }}>
            {mail.user_from.name}
          </Typography>
          <Typography sx={mail.is_read === 0 ? { width: "33%", fontWeight: "bold"} : {width: "33%"}}>
            {mail.subject}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={mail.is_read === 0 ? {fontWeight: "bold"} : { color: "text.secondary"}}>
            {mail.body}
          </Typography>
        </AccordionDetails>
      </Accordion>

    ))}
    </>
}
        
      
    </div>
  );
};

export default IncomingMessagesTable;
