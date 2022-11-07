import { auth } from '../firebase'
import { clearUser } from '../features/userSlice'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { useEffect,useState } from 'react';
import ChatBar from './ChatBar';
import ChatBody from './ChatBody';
import ChatFooter from './ChatFooter';
import axios from 'axios';
import "./style.css"


function Profile({socket}) {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [userList,setUserList] =useState([])
   const [chatOn,setChatOn] = useState(false)
   const [socketInstance, setSocketInstance] = useState("");
   const [messages,setMessages] = useState([])
  

   useEffect(() => {
    axios.get('http://localhost:5000/')
    .then(response => {
        setUserList(response.data)
    })
    .catch(function (error){})
}, [])
useEffect(()=> {
  socket.on("messageResponse", data => setMessages([...messages, data]))
}, [socket, messages])

   const signOutChat = (e) => {
    auth.signOut()
    localStorage.clear()
    var uid = JSON.parse(localStorage.getItem("user")).uid
    axios.post('http://localhost:5000/signout',uid)
    dispatch(clearUser())
    navigate("/")


  }
  function sendMessage(user){
    if (user == JSON.parse(localStorage.getItem("user")).email){
      setSocketInstance(socket);
      socket.on("connect", (data) => {
      console.log(data);
      

    });
    setChatOn(true)
    }
  }
 


  return (
      <div className='center'>
        <div className='profile'>
          <h1>Profile</h1>
          <p><strong>Welcome {JSON.parse(localStorage.getItem("user")).email} </strong></p>
          <h4>
            Online Users:<br></br>
          </h4>
          
          <br></br>
          <button onClick={signOutChat}>Sign Out</button>
        </div>
        <div className="chat">
      <ChatBar userList={userList} socket ={socket} />
      <div className="chat__main">
        <ChatBody messages={messages}  />
        <ChatFooter socket ={socket}/>
      </div>
    </div>
      </div>
  )
}

export default Profile