import { useContext, useState } from "react"
import { AuthContext } from "../Context/AuthProvider"
import { Avatar, Box, Menu, MenuItem, Typography } from "@mui/material";

export default function UserMenu() {
  const { user : {displayName , photoURL , auth}} = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  
  const open = Boolean(anchorEl); 

  const handleLogout = () => {
    auth.signOut();
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget)
  }

  return (
    <>
        <Box sx={{display:"flex"}} onClick={handleClick}>
            <Typography>{displayName}</Typography> 
            <Avatar alt="avatar" src={photoURL} sx={{width:25,height:25,ml:5}}/>
        </Box>
        <Menu
            id="basic-menu"
            anchorEl={anchorEl} // liên quan tới việc hiển thị menu ở dưới avarta user 
            //, value của nó sẽ là 1 DOM element (e.currentTarget) như button hay cái gì đó 
            //ta click vào để show menu
            open={open} // true thì menu sẽ đc hiển thị trên UI
            onClose={handleClose}
        >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
    </>
    
  )
}
