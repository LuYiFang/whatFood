import { IconButton, Toolbar, Typography } from '@mui/material';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AppBar from '@mui/material/AppBar';

export default function Header(props) {
    return <>
        <AppBar position='static'>
            <Toolbar>
                <IconButton
                 size='large'
                 edge="start"
                 color="inherit"
                 >
                    <FastfoodIcon />
                </IconButton>
                <Typography variant='h6' component='div'>What Food</Typography>
            </Toolbar>
        </AppBar>
    </>
}