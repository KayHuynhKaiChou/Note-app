import { Box,Card, CardContent,List, Typography } from '@mui/material'
import { Link, useParams } from 'react-router-dom'
import NewFolder from './NewFolder';
import { styled } from '@mui/material/styles';
// eslint-disable-next-line react/prop-types
export default function FolderList({folders}) {
  const {folderId} = useParams(); // khi click vào thẻ <Link> ở dưới thì to={`folders/${id}`} sẽ đc thực thi , khi đó current URL that were matched with path trong router trong routers/index.js 
  // khi đó useParams sẽ đc kích hoạt và render lại FolderList
  console.log(folderId)
 // const [activeFolderId , setActiveFolderId] = useState(folderId);

  const HoverCard = styled(Card)`
    &:hover {
      background-color: #e0e0e0; /* Màu sắc mong muốn khi hover */
    }
  `

  return (
    <List
        sx={{
            width:'100%',
            bgcolor: '#7D9D9C',
            height:'100%',
            padding: '10px',
            textAlign: 'left',
            overflowY:'auto'
        }}
        subheader={
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontWeight: 'bold', color: 'white' }}>
                Folders
              </Typography>
              <NewFolder />
            </Box>
        }
    >
      {
        // eslint-disable-next-line react/prop-types
        folders.map(({ id , name}) => {
            return (
                <Link
                    key={id}
                    to={`folders/${id}`}
                    style={{textDecoration: 'none'}}
                    //onClick={() => setActiveFolderId(id)}
                >
                {console.log('aaa')}
                    <HoverCard 
                      sx={{
                        mb:'10px',
                        backgroundColor: id == folderId ? 'rgb(255 211 140)' : null
                      }}
                    >
                        <CardContent
                            sx={{ '&:last-child': { pb: '10px' }, padding: '10px' }}
                        >
                            <Typography>{name}</Typography>
                        </CardContent>
                    </HoverCard>
                </Link>
            )
        })
      }
    </List>
  )
}
