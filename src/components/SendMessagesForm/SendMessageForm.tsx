import React, { useState, useEffect, useContext } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import {
  useForm,
  Controller,
  SubmitHandler,
  useFormState,
} from "react-hook-form";
import { UserContext } from "../../App";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import "./send-message-form.css";
import https from "../../https";
import { IUser } from "../../App";
import { MailsContext } from "../../pages/send-messages-page";
import {useNavigate} from "react-router-dom";

interface ISendMessageForm {
  userTo: IUser;
  title: string;
  message: string;
  userFrom: IUser|null;
}

const SendMessageForm: React.FC = () => {

  const userFromContext = useContext(UserContext);
  const mailsContext = useContext(MailsContext);
  const navigate = useNavigate();

  useEffect(() => {
      getUsers();
  }, [userFromContext?.user]);

  const getUsers = async () => {
    try {
      const users = await https.get("/users");
      setUsers(users.data)
    } catch (e) {
      console.log(e);
    }
  };

  const [users, setUsers] = useState<IUser[]>([]);

  const { handleSubmit, control, setValue, reset } = useForm<ISendMessageForm>({
    mode: "onChange",
  });

  const { errors, isValid } = useFormState({
    control,
  });

  const getMails = async (userTo : IUser|null) => {
    try{
      if(userTo && userFromContext?.user) {
        const res = await https.post('sent-mails',
          {
            from_user_id: userFromContext?.user.id,
            to_user_id: userTo.id
          });
        return res.data;
      }
    }
    catch (e){
      console.log(e);
    }
    return null;

  }

  const onSubmit: SubmitHandler<ISendMessageForm> = async (data) => {
    data.userFrom = userFromContext?.user ? userFromContext?.user : null;
    const res = await https.post('create-message', data);
    const mails = await getMails(data.userTo);
    mailsContext?.setMails(mails);
    reset({
      title: "",
      message: "",
      userTo: data.userTo
    });
  }
  

  return (
    <div className="send-message-form_wrapper">
      <form className="send-message-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="select-recipient">
          <Typography variant="h6" gutterBottom>
            Select recipient:
          </Typography>

          <Controller
            control={control}
            name="userTo"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                disablePortal
                onChange={async (event, value:IUser|null) => {
                  const mails = await getMails(value);
                  mailsContext?.setMails(mails);
                  return onChange(value);
                }}
                options={users}
                isOptionEqualToValue={(option, value) => option.name === value.name}
                getOptionLabel={(option) => option.name}
                sx={{ width: 300 }}
                renderInput={(params) => 
                  <TextField 
                    {...params} 
                    label="Name" 
                    onChange={onChange}
                  />}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="title"
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label="Title"
              size="small"
              margin="normal"
              fullWidth={true}
              onChange={(e) => field.onChange(e)}
              value={field.value || ""}
              // error={!!errors.title?.message}
              // helperText={errors.title?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="message"
          rules={{ required: true }}
          render={({ field }) => (
            <TextareaAutosize
              aria-label="Message"
              placeholder="Message"
              style={{ width: 500, height: 100, padding: 10 }}
              onChange={(e) => field.onChange(e)}
              value={field.value || ""}
              // error={!!errors.message?.message}
              // helperText={errors.message?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth={true}
          disableElevation={true}
          disabled={!isValid}
          sx={{
            marginTop: 2,
          }}
        >
          Send
        </Button>
      </form>
    </div>
  );
};

export default SendMessageForm;
