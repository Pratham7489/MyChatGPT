import './Sidebar.css';
import { useContext, useEffect } from 'react';
import { MyContext } from './MyContext';
import { v4 as uuidv4 } from 'uuid';

function Sidebar() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { allThreads, setAllThreads, curThreadId, setNewChat, setPrompt, setReply, setCurThreadId, setPrevChats } = useContext(MyContext);

    const getAllThreads = async () => {

        try {
            const response = await fetch(`${API_URL}/thread`); 

            if (!response.ok) {
                const text = await response.text();
                console.error("Thread API failed:", response.status, text);
                return;
            }
            const res = await response.json();
               
            const filteredData = res.map(thread => ({
                threadId: thread.threadId, 
                title: thread.title
            }));
            setAllThreads(filteredData);

        } catch (error) {
            console.log(error, "Error in fetching all threads");
        }
    };

    useEffect(() => {
        getAllThreads();

    }, [curThreadId]);

    const createNewChat = () => {
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurThreadId(uuidv4());
        setPrevChats([]);
    }; 

    const changeThread = async (newThreadId) => {
        setCurThreadId(newThreadId);

        try {
            const response = await fetch(`${API_URL}/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res);
            setPrevChats(res);
            setNewChat(false);
            setReply(null);

        } catch (error) {
            console.log(error);
        }
    }

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`${API_URL}/thread/${threadId}`, {method: "DELETE"});
            const res = await response.json();
            console.log(res);

            //updated threads re-render
            setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

            if(threadId === curThreadId) {
                createNewChat();
            }
            
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className='logo' />
                <span>
                    <i className="fa-regular fa-pen-to-square"></i>
                </span>
            </button>

            {/* history Panel */}
            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li 
                            key={idx}
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === curThreadId? "highlighted" : " "}
                        >
                            {thread.title}
                            <i 
                                className="fa-solid fa-trash"
                                onClick={(e) => {
                                    e.stopPropagation(); // stop event bubbling
                                    deleteThread(thread.threadId);
                                }}
                            ></i>
                        </li>
                    ))
                }
            </ul>   

            {/* signin/signout */}
            <div className="sign">
                <p>Made by Pratham &hearts;</p>
            </div>

        </section>
    )
}       

export default Sidebar;