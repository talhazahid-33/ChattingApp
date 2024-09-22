import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';

function SimpleDialog(props) {
  const { onClose, selectedValue, open,usernames } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };


  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select Username</DialogTitle>
      <List sx={{ pt: 0 }}>
        {usernames.map((email) => (
          <ListItem disableGutters key={email}>
            <ListItemButton onClick={() => handleListItemClick(email)}>
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={email} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};

export default function RoomCreation(props) {
  const [open, setOpen] = React.useState(false);
  const usernames = ['username@gmail.com', 'user02@gmail.com','user4','fush','username@gmail.com'];
  const [selectedValue, setSelectedValue] = React.useState(props.usernames[1]);

  React.useEffect(()=>{
  })
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
    props.createRoom(value);
  };

  return (
    <div>
      
      <Button  style={{ marginLeft:'4%', width: "27vw", height:"50px" }}variant="contained" onClick={handleClickOpen}>Add USer
      </Button>
      <SimpleDialog
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        usernames = {props.usernames}
      />
    </div>
  );
}
