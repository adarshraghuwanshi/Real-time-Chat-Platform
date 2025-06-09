import React,{useEffect} from 'react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import CreateChannel from './CreateChannel';


export default function Channel({channels, changeChat, contacts}) {

  

  const handleChangeChat = (index, channel, ch) => {

    changeChat(channel, ch);
    
  }
  return (
  <div className="p-6 bg-gray-50 rounded-xl shadow-md space-y-6">
    {/* Header with Title & Create Channel Button */}
    <div className="flex items-center justify-between">
      <h1
        onClick={() => setChannel(true)}
        className={`text-lg font-semibold cursor-pointer px-5 py-2 rounded-full transition-all duration-200 ${
          Channel
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-700 hover:bg-blue-100"
        }`}
      >
        Channels
      </h1>
      <CreateChannel contacts={contacts} />
    </div>

    {/* Channel List */}
    <ScrollArea className="h-64 w-full rounded-lg border border-gray-200 bg-white shadow-inner">
      <div className="flex flex-col space-y-3 p-4">
        {channels.length > 0 ? (
          channels.map((channel, index) => (
            <div
              key={channel._id}
              onClick={() => handleChangeChat(index, channel, true)}
              className="p-3 rounded-lg bg-gray-100 hover:bg-blue-50 cursor-pointer transition-all shadow-sm border border-gray-100"
            >
              <p className="text-sm font-medium text-gray-800">
                #{channel.name}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500">No channels found.</p>
        )}
      </div>
      <ScrollBar />
    </ScrollArea>
  </div>
);
}