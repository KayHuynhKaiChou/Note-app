import { Box, Card, CardContent, Grid, IconButton, List, Tooltip, Typography } from "@mui/material";
import { Link, Outlet, useLoaderData, useParams , useSubmit , useNavigate } from "react-router-dom";
import {NoteAddOutlined} from '@mui/icons-material'
import { useEffect, useState } from "react";
import moment from 'moment'

export default function NoteList() {
    const {folder : {notes}} = useLoaderData(); // lấy từ field loader của router
    const {noteId , folderId} = useParams(); console.log('lẹ lẹ',{noteId , folderId})
    const [activeNoteId, setActiveNoteId] = useState(noteId);
    const submit = useSubmit();
    const navigate = useNavigate();

  useEffect(() => {
    console.log(notes)
    if(noteId){//(1)
        setActiveNoteId(noteId);
        console.log('setActiveNoteId')
        return;
    }

    // select note đầu tiên click vào 1 folder chứa list notes
    if(notes?.[0]){//(2)
        console.log('navigate notes[0].id')
        navigate(`note/${notes[0].id}`)
    }

    //Lần đầu vô app thì path là http://127.0.0.1:5173/ , khi ta click vào 1 folder thì khi đó giả sử path là http://127.0.0.1:5173/folders/64d1f8d86d12befb164aab21
    //,khi đó router sẽ chạy lại từ path : '/' đến path : '/folders/:folderId' , tại path /folders/:folderId thì chạy NoteList LẦN ĐẦU và useEffect sẽ run vì NoteList mouted vào DOM
    //,khi đó trong callback của useEffect sẽ run (2) vì noteId là null hay nói cách khác là noteId chưa có trên url path , tiếp đến run navigate(`note/${notes[0].id}`)
    //, khi đó url match với path giả sử là 'http://127.0.0.1:5173/folders/64d1f8d86d12befb164aab21/note/64dae15a2435ead24cf172cb'(*) , lúc này cx run lại từ '/' đến path : '/folders/:folderId' đến : '/note/:noteId'  
    //, thì tại lúc run lại cái NoteList khi path là '/folders/:folderId' thì noteId từ useParams đã khác null (vì (*) có noteId) , lúc này useEffect sẽ đc run lại vì noteId thay đổi chứ ko phải run lại do NoteList được gọi lần 2
    // vì vốn NoteList đã được mouted từ đầu và chỉ 1 lần duy nhất khi còn ở http://127.0.0.1:5173/ , nên về sau mà ta thấy useEffect được gọi lại là do [noteId,notes] có 1 trong 2 ele đã change value

    //KHI KO CÓ notes trong dependency ở TH1,  lúc đầu vào app http://127.0.0.1:5173/ , bạn đã click vô 1 folder có notes thì cái <Note /> sẽ run vì useEffect đã run (vì <NoteList /> được mounted lần đầu truy cập) và thực hiện navigate(...)
    // ,tiếp theo bạn click vô 1 folder cũng có notes thì cái <Note /> sẽ run vì useEffec sẽ run do dependency noteId thay đổi từ noteId của folder trước đó thành null vì path lúc này là http://127.0.0.1:5173/folders/:folderId/
    // sau đó callback của useEffect sẽ run (2) như bth 

    //KHI KO CÓ notes trong dependency ở TH2,  lúc đầu vào app http://127.0.0.1:5173/ , bạn đã click vô 1 folder KO CÓ notes thì cái <Note /> sẽ run vì useEffect đã run (vì <NoteList /> được mounted lần đầu truy cập) và thực hiện navigate(...) 
    //nhưng vì ko có notes nào hết nên nodeId trong path là null nên cx ko hiển thị gì ,tiếp theo bạn click vô 1 folder có notes(.) thì cái <Note /> sẽ KO run vì 
    //useEffec sẽ KO run do dependency noteId KO thay đổi vì noteId của folder trước đó là null và noteId lúc này cx là null vì path lúc này là http://127.0.0.1:5173/folders/:folderId/
    // do đó TA PHẢI THÊM 1 ELE vào dependency là notes , nếu có notes trong tình huống này thì notes lúc trước (ko có gì hết) và notes bây giờ (có note đó (.)) là khác nhau nên useEffect sẽ run và navigate sẽ run và <Note/> sẽ hiển thị

    //Kết luận cuối cùng : <NoteList/> sẽ được run lại nhiều lần do phần router nhưng useEffect của <NoteList/> chạy do <NoteList/> được mouted LÀ 1 LẦN ,
    // những lần sau mà useEffect có run lại là do dependency change . HAy cuối cùng là mặc dù <NoteList/> được run lại nhiều lần nhưng mỗi lần run lại đều dùng chung cái useEffect ban đầu
    // vì vốn <NoteList/> chỉ bị thay đổi content chứ ko bị unmouted
},[noteId,notes])

  const handleAddNewNote = () => {
    submit({
        content: '',  // {content,folderId} sẽ là đối số resquest.formData() ở trong noteUtils //thì nó ko chạy cái <Note /> vì useEffec ko run do dependency noteId ko thay đổi
        folderId
    },{ method:'POST', action: `/folders/${folderId}`}) 
  }

  return (
    <Grid container height='100%'>
        <Grid item xs={4} sx={{width:'100%',height:'100%',maxWidth:360, bgcolor:'#F0EBE3' , overflowY:'auto', padding:'10px'}}>
            <List
                subheader={
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{fontWeight:'bold'}}>Notes</Typography>
                        <Tooltip title='Add Note' onClick={handleAddNewNote}>
                            <IconButton size='small'>
                            <NoteAddOutlined />
                            </IconButton>
                        </Tooltip>
                    </Box>
                }
            >
                {
                    notes.map(({id, content, updatedAt}) => {
                        return (
                            <Link
                            key={id}
                            to={`note/${id}`}
                            style={{textDecoration:'none'}}
                            >
                                <Card sx={{
                                    mb:'10px',
                                    backgroundColor: id === activeNoteId ? 'rgb(255 211 140)' : null,
                                    textAlign : "left"
                                }}
                                >
                                    <CardContent
                                        sx={{ '&:last-child': { pb: '10px' } }}
                                    >
                                        <div
                                            style={{ fontSize: '16px', fontWeight: 'bold' }}
                                            dangerouslySetInnerHTML={{ 
                                                __html: `${content.substring(0, 30) || 'Empty'}`,
                                            }}
                                        />
                                        <Typography sx={{fontSize:'10px'}}>
                                            {moment(updatedAt).format('MMMM Do YYYY, h:mm:ss a')}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Link>
                        )
                    })
                }
            </List>
        </Grid>
        <Grid item xs={8}>
            <Outlet /> {/** hoặc là <Note /> = <Outlet /> ngay tại thời điểm click vào NoteList*/}
        </Grid>      
    </Grid>
  )
}
