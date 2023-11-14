import ReactDOM from 'react-dom/client'
import {RouterProvider} from 'react-router-dom';
import router from './routers'
import './firebase/config'
import './index.css';
import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Container } from '@mui/material';

ReactDOM.createRoot(document.getElementById('root')).render(
    <Container maxWidth="lg" sx={{textAlign : 'center'}}>
      <RouterProvider router={router} />
    </Container>
)
