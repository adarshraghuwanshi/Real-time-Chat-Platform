import { createContext, useContext, useEffect, useRef } from 'react';
const SocketContext = createContext(null);
import { io } from 'socket.io-client';
import {host} from '../utils/routes.js';
export const useSocket = () => {
    return useContext(SocketContext);
};
export const SocketProvider = ({ children }) => {
    const socket = useRef(null);
    const userInfo = JSON.parse(localStorage.getItem("chat-app-user")) || null;

    useEffect(() => {
        // Initialize the socket connection
        if(userInfo){
            socket.current = io(host, {
                withCredentials: true,
                query: {
                    userId: userInfo._id // Pass user ID in the query
                }
            })
            socket.current.on("connect",()=>{
                console.log("Socket connected with ID:", socket.current.id);
            })
        }


        // const handleReceiveMessage = (message) => {
        //     console.log("Message received:", message);
            
        // }
        
        // socket.current.on("receiveMessage", handleReceiveMessage);

        

        return ()=>{
            socket.current.disconnect();
            console.log("Socket disconnected");
        }

        
        
    }, [userInfo]);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
}