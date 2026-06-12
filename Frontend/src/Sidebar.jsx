// import React from 'react'
// import "./Sidebar.css";
// import { useContext, useEffect } from "react";
// import { MyContext } from "./MyContext.jsx";
// import {v1 as uuidv1} from "uuid";
// import "@fortawesome/fontawesome-free/css/all.min.css";

// export const Sidebar = () => {
//    const {allThreads, setAllThreads, currThreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPrevChats} = useContext(MyContext);

//     const getAllThreads = async () => {
//         try {
//             const response = await fetch("http://localhost:8080/api/thread");
//             const res = await response.json();
//              const filteredData = res.map(thread => ({threadId: thread.threadId, title: thread.title}));
//              //console.log(filteredData);
//              setAllThreads(filteredData);
//         } catch(err) {
//             console.log(err);
//         }
//     };

//     useEffect(() => {
//         getAllThreads();
//     }, [currThreadId])

//     const createNewChat = () => {
//         setNewChat(true);
//         setPrompt("");
//         setReply(null);
//         setCurrThreadId(uuidv1());
//         setPrevChats([]);
//     }

//     const changeThread = async (newThreadId) => {
//         setCurrThreadId(newThreadId);

//         try {

//             const token = localStorage.getItem("token");
//             if (!token) return; 
            
//             const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
//             const res = await response.json();
//             console.log(res);
//             setPrevChats(res);
//             setNewChat(false);
//             setReply(null);
//         } catch(err) {
//             console.log(err);
//         }
//     }   

//     const deleteThread = async (threadId) => {
//          try {
//             const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, {method: "DELETE"});
//             const res = await response.json();
//             console.log(res);

//             //updated threads re-render
//             setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

//             if(threadId === currThreadId) {
//                 createNewChat();
//             }

//         } catch(err) {
//             console.log(err);
//         }
//     }

//    return (
//      <section className="sidebar">
//             <button onClick={createNewChat}>
//                 <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
//                      <span className="btn-text">
//                          <i className="fa-solid fa-plus"></i> New Chat
//                      </span>
//                 <span><i className="fa-solid fa-pen-to-square"></i></span>
//             </button>


//             <ul className="history">
//                 {
//                     allThreads?.map((thread, idx) => (
//                         <li key={idx} 
//                             onClick={(e) => changeThread(thread.threadId)}
//                             className={thread.threadId === currThreadId ? "highlighted": " "}
//                         >
//                             {thread.title}
//                             <i className="fa-solid fa-trash"
//                                 onClick={(e) => {
//                                     e.stopPropagation(); 
//                                     deleteThread(thread.threadId);
//                                 }}
//                             ></i>
//                         </li>
//                     ))
//                 }
//             </ul>
 
//             <div className="sign">
//                 <p>Divya Singh &hearts;</p>
//             </div>
//         </section>
//   )
// }






import React, { useContext, useEffect } from 'react';
import "./Sidebar.css";
import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";
import "@fortawesome/fontawesome-free/css/all.min.css";

export const Sidebar = () => {
  const {
    allThreads, setAllThreads,
    currThreadId, setNewChat, setPrompt, setReply,
    setCurrThreadId, setPrevChats,
    theme, toggleTheme   
  } = useContext(MyContext);

  const getAllThreads = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/thread");
      const res = await response.json();
      const filteredData = res.map(thread => ({
        threadId: thread.threadId,
        title: thread.title
      }));
      setAllThreads(filteredData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getAllThreads();
  }, [currThreadId]);

  const createNewChat = () => {
    setNewChat(true);
    setPrompt("");
    setReply(null);
    setCurrThreadId(uuidv1());
    setPrevChats([]);
  };

  const changeThread = async (newThreadId) => {
    setCurrThreadId(newThreadId);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
      const res = await response.json();
      setPrevChats(res);
      setNewChat(false);
      setReply(null);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteThread = async (threadId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
      const res = await response.json();
      console.log(res);

      setAllThreads(prev => prev.filter(thread => thread.threadId !== threadId));

      if (threadId === currThreadId) {
        createNewChat();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="sidebar">
      {/* New Chat button */}
      <button onClick={createNewChat} className="new-chat-btn">
        <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo" />
        <span className="btn-text">
          <i className="fa-solid fa-plus"></i> New Chat
        </span>
       <span><i className="fa-solid fa-pen-to-square"></i></span>
      </button>

      {/* Dark/Light mode toggle */}
      <button onClick={toggleTheme} className="theme-toggle">
         {theme === "light" ? (
           <><i className="fa-solid fa-moon"></i> Dark Mode</>
            ) : (
           <><i className="fa-solid fa-sun"></i> Light Mode</>
               )}
      </button>


      <ul className="history">
        {allThreads?.map((thread, idx) => (
          <li key={idx}
              onClick={() => changeThread(thread.threadId)}
              className={thread.threadId === currThreadId ? "highlighted" : ""}>
            {thread.title}
            <i className="fa-solid fa-trash"
               onClick={(e) => {
                 e.stopPropagation();
                 deleteThread(thread.threadId);
               }}></i>
          </li>
        ))}
      </ul>

      <div className="sign">
        <p>Divya Singh &hearts;</p>
      </div>
    </section>
  );
};
