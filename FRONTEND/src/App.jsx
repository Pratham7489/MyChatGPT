import React from 'react' 
import Sidebar from './Sidebar.jsx'
import ChatWindow from './ChatWindow.jsx'
import { MyContext } from './MyContext.jsx'
import { useState } from 'react'
import { v4 as uuidv4 } from 'uuid';
import './App.css'

function App() {
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState(null);
  const [curThreadId, setCurThreadId] = useState(uuidv4());
  const [prevChats, setPrevChats] = useState([]); // stores all chats of curr thread
  const [newChat, setNewChat] = useState(true);
  const [allThreads, setAllThreads] = useState([]);

  const providerValues = {
    prompt, setPrompt,
    reply, setReply,
    curThreadId, setCurThreadId,
    newChat, setNewChat,
    prevChats, setPrevChats,
    allThreads, setAllThreads,
  };

  return (
    <>
      <div className='app'>
        <MyContext.Provider value={providerValues}>
            <Sidebar />
            <ChatWindow />
        </MyContext.Provider>
      </div>
    </>
  )
}

export default App;
