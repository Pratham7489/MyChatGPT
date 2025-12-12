import './Chat.css';
import { useContext, useState, useEffect, useRef,  useLayoutEffect } from 'react';
import { MyContext } from './MyContext';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";

function Chat() {
    const chatRef = useRef(null);
    const { newChat, prevChats,reply } = useContext(MyContext);
    const [ latestReply, setLatestReply ] = useState(null);

    useEffect(() => {
        if(reply === null) {
            setLatestReply(null);
            return;
        };


        //latestReply separate => create typing useEffect
        if(!prevChats?.length) return ;

        if (!reply) return;
        setLatestReply(""); 

        const content = reply.split(" "); //individual words
        let idx = 0;

        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" "));
            idx++;
            
            if(idx >= content.length) clearInterval(interval);
        }, 40);

        return () => clearInterval(interval);

    }, [prevChats, reply])

    useLayoutEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTo({
                top: chatRef.current.scrollHeight,
                behavior: "smooth"
            });
        }
    }, [prevChats, latestReply]);

    return (
        <>
        {newChat && <h1>What’s on your mind today?</h1>}
        <div className="chats" ref={chatRef}>
            {
                prevChats?.slice(0, -1).map((chat, idx) => 
                    <div className={chat.role === "user"? "userDiv" : "gptDiv" } key={idx} >
                        {
                            chat.role === "user"?
                            <p className='userMessage'>{chat.content}</p> : 
                            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
                        }
                    </div>
                )
            }

            {
                prevChats.length > 0 && (
                    <>
                        {
                            latestReply === null ?(
                                <div className="gptDiv" key={"non-typing"}>
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length - 1].content}</ReactMarkdown>
                                 </div>  
                            ) : (
                                <div className="gptDiv" key={"typing"}>
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
                                </div>
                            )
                        }
                    </>
                )
            }
            
        </div>
        </>
    )
}

export default Chat;