import React, {useState}  from 'react'
import IncomingMessagesTable from '../../components/IncomingMessagesTable'
import  './incoming-messages-page.css'
import {IUser} from "../../App";


interface MailsContextType {
  mails: IMail [] | null,
  setMails :(mails: IMail [] | null) => any
}

export interface IMail{
  subject: string,
  user_to: IUser,
  user_from: IUser,
  body: string,
  is_read: number,
  created_at: string
}

export const MailsContext = React.createContext<MailsContextType | null>(null);

export const IncomingMessagesPage:React.FC = () => {

  const [mails, setMails] = useState<IMail[] | null>(null);
  
  return (
    <div>
      <MailsContext.Provider value={{mails:mails, setMails:setMails}}>
        <IncomingMessagesTable />
      </MailsContext.Provider>
    </div>
  )
}
