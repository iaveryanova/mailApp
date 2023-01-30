import React, {useState} from "react";
import PreviouslySentMessages from "../../components/PreviouslySentMessages";
import SendMessageForm from "../../components/SendMessagesForm/SendMessageForm";
import "./send-messages-page.css";
import {IUser} from "../../App";

interface MailsContextType {
  mails: IMail [] | null,
  setMails :(mails: IMail [] | null) => any
}

export interface IMail{
  id: number,
  subject: string,
  user_to: IUser,
  user_from: IUser,
  body: string,
  is_read: number,
  created_at: string
}

export const MailsContext = React.createContext<MailsContextType | null>(null);

export const SendMessagesPage: React.FC = () => {

  const [mails, setMails] = useState<IMail[] | null>(null);

  return (
    <div className="sendMessagesPage" >
      <MailsContext.Provider value={{mails:mails, setMails:setMails}}>
        <SendMessageForm />
        <PreviouslySentMessages />
      </MailsContext.Provider>
    </div>
  );
};
