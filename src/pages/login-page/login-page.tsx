import React, {useContext, useEffect} from 'react'
import  './login-page.css'
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import https from "../../https";
import {
    useForm,
    Controller,
    SubmitHandler,
    useFormState
  } from "react-hook-form";
import { UserContext } from '../../App';
import { useNavigate } from 'react-router-dom';


  interface ISignInForm {
    name: string;
  }

export const LoginPage:React.FC = () => {

    const context = useContext(UserContext);
    const navigate = useNavigate();

    const { handleSubmit, control, setValue } = useForm<ISignInForm>({
        mode: "onChange"
    });

    const { errors, isValid } = useFormState({
        control, 
    });


    const onSubmit: SubmitHandler<ISignInForm> = async (data) => {

        try {
            const user = await https.post("/login", data);
            context?.setUser(user.data);
            // localStorage.setItem('user', JSON.stringify(user.data));
            navigate('send');
        } catch (e) {
            console.log(e);
        }
    }

  return (
    <div className='login-page'>
        <Typography variant="h4" component="div">
      Authorization
      </Typography>

      <Typography
        variant="subtitle1"
        component="div"
        gutterBottom={true}
        className="auth-form_subtitle"
      >
        To get access
      </Typography>


      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          control={control}
          name="name"
          rules={{ required: true }}
          render={({ field }) => (
            <TextField
              label="Name"
              size="small"
              margin="normal"
              className="auth-form_input"
              fullWidth={true}
              onChange={(e) => field.onChange(e)}
              value={field.value || ''}
              error={!!errors.name?.message}
              helperText={errors.name?.message}
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
          Login
        </Button>

      </form>
    </div>
  )
}
