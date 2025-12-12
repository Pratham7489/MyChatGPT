import './ChatWindow.css';
import Chat from './Chat.jsx';
import { MyContext } from './MyContext.jsx';
import { useContext, useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners'

function ChatWindow() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { prompt, setPrompt, reply, setReply, curThreadId, setCurThreadId, prevChats, setPrevChats, setNewChat, latestReply } = useContext(MyContext);
    const [ loading , setLoading ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);  

    const getReply = async () => {
        setLoading(true);
        console.log("message", prompt, "threadId", curThreadId);
        const options = {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: prompt,
                threadId: curThreadId
            })
        };
        
        try {
            const response = await fetch(`${API_URL}/chat`, options);
            const res = await response.json();
            console.log("Response from backend:", res);
            setReply(res.reply);
        
        } catch (error) {
            console.log("Error fetching reply:", error);
        }
        setLoading(false);
    }

    // Append new chats to prevChats
    useEffect(() => {
        if(prompt && reply) {
            setNewChat(false);

            setPrevChats(prev => [
                ...prev,
                { role: "user", content: prompt },
                { role: "assistant", content: reply }
            ]);
        }
        setPrompt("");
    }, [reply]);

    const handleProfileClick = () => {
        setIsOpen(!isOpen);
    }


    return (
        <div className="chatwindow">
            <div className='navbar'>
                <span>My_ChatGPT<i className="fa-solid fa-angle-down"></i></span>
                <div className="userIconDiv" onClick={handleProfileClick}>
                    <span className='userIcon'>
                        <i className="fa-solid fa-user"></i>
                    </span>
                </div>
            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItems"><i class="fa-solid fa-gear"></i> Settings</div>
                    <div className="dropDownItems"><i className="fa-solid fa-bolt"></i> Upgrad plan</div>
                    <div className="dropDownItems"><i class="fa-solid fa-arrow-right-from-bracket"></i> Log out</div>
                </div>
            }
            
            {/* Chat messages will display here */}
            <Chat />

            <PulseLoader color='#fff' loading={loading} />

            {/* Input field for sending new messages */}
            <div className='chatInput'>
               <div className="inputBox">
                    <input 
                        type="text" 
                        placeholder='Ask anything'
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                getReply();
                            }
                        }}
                    ></input>
                    <div id='submit' onClick={getReply}>
                        <i className="fa-solid fa-paper-plane"></i>
                    </div>
               </div>
               
               <div>
                <p className='info'>
                    My_ChatGPT can make mistakes. Check important info. See Cookie Preferences.
                </p>
               </div>
            </div>

        </div>
    )   
}

export default ChatWindow;