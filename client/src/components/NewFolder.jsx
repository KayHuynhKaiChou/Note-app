import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Tooltip } from "@mui/material";
import {CreateNewFolderOutlined} from '@mui/icons-material'
import { useEffect, useState } from "react";
import { useSearchParams , useNavigate} from "react-router-dom";
import { addNewFolder } from "../utils/folderUtils";

export default function NewFolder() {
  console.log('lslslsl')
  const [open,setOpen] = useState(false);
  const [newFolderName,setNewFolderName] = useState('');
  const [searchParams ,setSearchParams] = useSearchParams({});
  const popupName = searchParams.get('popup');
  const navigate = useNavigate();

  const handleOpenPopUp = () => {
    setSearchParams({popup : 'add-folder'})
  }

  const handleNewFolderNameChange = (e) => {
    setNewFolderName(e.target.value);
  }

  const handleClose = () => {
    setNewFolderName('')
    navigate(-1); // is the same setOpen(false) , bên cạnh đó mục đích chính là quay lại trang trước đó
  }

  const handleAddNewFolder = async () => {
    await addNewFolder({name : newFolderName});
    handleClose();
  }

  useEffect(() => {
    if(popupName === 'add-folder'){
      setOpen(true);
      return;
    }

    setOpen(false);
  },[popupName])

  return (
    <div>
      <Tooltip title='Add Folder' onClick={handleOpenPopUp}>
        <IconButton size="small">
          <CreateNewFolderOutlined sx={{color: "white"}} />
        </IconButton>
      </Tooltip>
      <Dialog open={open}>
        <DialogTitle>New Folder</DialogTitle>
        <DialogContent>
          <TextField
            id="name"
            autoFocus
            size="small"
            margin="dense"
            sx={{width : '400px'}}
            autoComplete="off"
            fullWidth
            label="Folder Name"
            value={newFolderName}
            onChange={handleNewFolderNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAddNewFolder}>OK</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
