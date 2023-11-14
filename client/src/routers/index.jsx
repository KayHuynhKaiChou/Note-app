import { createBrowserRouter , Outlet } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'
import AuthProvider from '../Context/AuthProvider'
import ProtectedRoute from './ProtectedRoute'
import ErrorPage from '../pages/ErrorPage'
import NoteList from '../components/NoteList'
import Note from '../components/Note'
import { addNewNote, noteLoader, notesLoader, updateNote } from '../utils/noteUtils'
import { foldersLoader } from '../utils/folderUtils'

// eslint-disable-next-line react-refresh/only-export-components
const AuthLayout = () => {
    return (
        <AuthProvider>
            <Outlet />
        </AuthProvider>
    )
}

const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        errorElement: <ErrorPage />,
        children : [
            {
                element: <Login />,
                path: '/login'
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        // giả sử khi url map với path '/' thì loader: foldersLoader sẽ run => <AuthLayout/> => <ProtectedRoute /> => <Home />
                        element: <Home />,
                        path: '/',
                        loader: foldersLoader,
                        children: [
                            {
                                element: <NoteList />,
                                path: 'folders/:folderId', //If a path segment starts with : then it becomes a "dynamic segment".
                                action: addNewNote, // method này có 1 tham số là params , dynamic segment will be parsed from the URL and provided as 'params' hay params.folderId
                                loader: notesLoader, // cũng tương tự như action , method cx có 1 tham số params object có (key,value) là dynamic segment (:folderId)
                                children : [
                                    {
                                        element: <Note/>,
                                        path: 'note/:noteId',// khi path này đc match với url thì các path ở trên ( paths cha ) sẽ chạy lại
                                        action: updateNote,
                                        loader : noteLoader
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }
])

export default router