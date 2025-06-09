import React, {useState, useEffect} from 'react'
import Contacts from '../../components/ui/Contacts'
import Channel from '../../components/ui/Channel'
import ChatContainer from '../../components/ui/ChatContainer'
import Welcome from '../../components/ui/Welcome'
import { fetchDMList, getAllUsersRoute, getAllChannels } from '../../utils/routes'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import Logout from '../../components/ui/Logout'

 function Chat() {
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [DM, setDM] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [dmList, setDMList] = useState([]);
  const [channels, setChannels] = useState([]);
  
  const [channelChat, setChannelChat] = useState(false);
  const Navigate = useNavigate();


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chat-app-user"))
    if (user) {
      setCurrentUser(user);
    }

    else {
      console.error("No user found");
      Navigate('/auth');
    }
  }, []);
  



  
  useEffect(() => {
    const fetchList = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("chat-app-user"))
        const token = user?.token; 

        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

         const response = await axios.get( fetchDMList, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!response.data) {
             console.error('No data found');
              return;       
        }
        // console.log('DM List response:', response.data);
         const data= await response.data.contacts;
        
       const filteredData = data.map((item) => ({
             userId: item._id,
             email: item.email,
             firstName: item.firstName || "",  
             lastName: item.lastName || "",   
        }));
        setDMList(data);



        
      } catch (error) {
        console.error('Error fetching DM list:', error);
      }
    };

    fetchList();
  }, []);

  const handleChangeChat = (chat, ch) => {
    setCurrentChat(chat);
    setChannelChat(ch);
    
    console.log("Selected chat:", chat);
  }

  useEffect(() => {
    const fetchList = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("chat-app-user"))
        const token = user?.token; 

        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

         const response = await axios.get(getAllUsersRoute, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!response.data) {
             console.error('No data found');
              return;       
        }
        // console.log('DM List response:', response.data);
         const data= await response.data.contacts;
        
       const filteredData = data.map((item) => ({
             userId: item._id,
             email: item.email,
             firstName: item.firstName || "",  
             lastName: item.lastName || "",   
        }));
        setContacts(data);



        
      } catch (error) {
        console.error('Error fetching DM list:', error);
      }
    };

    fetchList();
  }, []);


  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("chat-app-user"))
        const token = user?.token; 

        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

         const response = await axios.get( getAllChannels, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (!response.data) {
             console.error('No data found');
              return;       
        }
        // console.log('channel list response:', response.data);
         const data= await response.data;
        
       const filteredData = data.map((item) => ({
             userId: item._id,
             name: item.name,
             firstName: item.firstName || "",  
             lastName: item.lastName || "",   
        }));
        setChannels(data);



        
      } catch (error) {
        console.error('Error fetching DM list:', error);
      }
    };

    fetchChannel();
  }, []);

  
  



 return (
    <div className="flex h-screen w-screen bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden text-gray-800">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white/90 backdrop-blur border-r border-gray-300 shadow-md flex flex-col">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/80">
          <h2 className="text-lg font-semibold text-gray-700">FlowChat</h2>
          <button
            onClick={() =>Navigate("/profile")}
            className="ml-2 px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
          >
            Profile
          </button>
        </div>

        {/* Contacts/Channels */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
          <div className="rounded-lg shadow-sm bg-white">
            <Contacts
              contacts={DM ? dmList : contacts}
              changeChat={handleChangeChat}
              setDM={setDM}
              DM={DM}
              setChannelChat={setChannelChat}
            />
          </div>
          <div className="rounded-lg shadow-sm bg-white">
            <Channel
              contacts={contacts}
              channels={channels}
              changeChat={handleChangeChat}
              setChannelChat={setChannelChat}
            />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-200 bg-white/80">
          <Logout />
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 bg-white/80 backdrop-blur-sm shadow-inner overflow-hidden p-4 flex flex-col">
        <div className="w-full h-full rounded-xl border border-gray-200 shadow-lg bg-white flex flex-col">
          {currentChat ? (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              channelChat={channelChat}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Welcome />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
export default Chat;