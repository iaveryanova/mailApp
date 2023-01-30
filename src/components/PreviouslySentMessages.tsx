import { Typography } from "@mui/material";
import React, { useContext } from "react";
import { MailsContext } from "../pages/send-messages-page";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const PreviouslySentMessages: React.FC = () => {
  const mailsContext = useContext(MailsContext);

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
  }));

  return (
    <div style={{ marginTop: 30 }}>
      { mailsContext?.mails && mailsContext?.mails.length > 0 &&
      <>
       <Typography variant="h6" gutterBottom>
        Previously Sent Messages
      </Typography>
      <TableContainer component={Paper}>
      <Table sx={{ maxWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Date</StyledTableCell>
            <StyledTableCell align="left">Title</StyledTableCell>
            <StyledTableCell align="left">Message Body</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
            {mailsContext.mails.map((row) => (
              <StyledTableRow key={row.subject}>
                <StyledTableCell component="th" scope="row">{row.created_at}</StyledTableCell>
                <StyledTableCell align="left">{row.subject}</StyledTableCell>
                <StyledTableCell align="left">{row.body}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
      </Table>
    </TableContainer>
      </>
      }
    </div>
  );
};

export default PreviouslySentMessages;
