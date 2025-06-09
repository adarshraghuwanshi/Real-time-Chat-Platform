import React, {useState, useEffect} from 'react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
import axios from 'axios';
import { searchContacts, host } from "../../utils/routes";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

export default function Contacts({contacts, changeChat, setDM, DM, setChannelChat}) {
  const [open, setOpen] = useState(false);

 


  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [loading, setLoading] = useState(false);

  function handleChangeChat(index, contact, ch) {
    setLoading(false);
    setSearchTerm("");
    changeChat(contact, ch);

  }
   useEffect(() => {
    if (!loading && filteredContacts.length > 0) {
      setOpen(false);
      setSearchTerm("");
    }
  }, [loading]);
const handleChange= async (e) => {
  e.preventDefault();
  setSearchTerm(e.target.value);
    setLoading(true);
    const token = JSON.parse(localStorage.getItem("chat-app-user"))?.token;
    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }

    const filtered =await axios.post( searchContacts,{searchTerm},{
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    })

    if (!filtered) {
      console.error("No contacts found");
      setLoading(false);
      return;
    }
   
    setFilteredContacts(filtered.data.contacts);
    console.log("Filtered Contacts:", filtered.data.contacts);
    
  }

  useEffect(() => {
        console.log("Contacts:", contacts);
      },[]);

  
 return (
  <div className="p-6 bg-gray-50 rounded-xl shadow space-y-6">
    {/* Toggle Buttons & Search */}
    <div className="flex items-center gap-4">
      <div className="flex gap-2 bg-white p-1 rounded-full shadow-inner">
        <button
          onClick={() => setDM(true)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            DM
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          DM
        </button>
        <button
          onClick={() => setDM(false)}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            !DM
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          Contacts
        </button>
      </div>

      {/* Search Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button className="ml-auto px-4 py-2 rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-all text-sm font-medium">
            🔍 Search
          </button>
        </DialogTrigger>
        <DialogContent className="bg-white rounded-xl p-6 shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Search Contacts
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-500 mt-1">
              Type a name or email to find users.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Search by name or email"
            value={searchTerm}
            onChange={handleChange}
            className="mt-4 w-full border border-gray-300 rounded-md p-2"
          />

          <ScrollArea className="h-48 mt-4 rounded-md border border-gray-200">
            <div className="flex flex-col space-y-2 p-2">
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => (
                  <div
                    key={contact._id}
                    onClick={() => {
                      handleChangeChat(index, contact, false);
                      setOpen(false);
                    }}
                    className="p-2 rounded-md bg-blue-50 hover:bg-blue-100 cursor-pointer transition"
                  >
                    <p className="text-sm text-gray-800">{contact.email}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No contacts found.</p>
              )}
            </div>
            <ScrollBar />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>

    {/* Contact List */}
    <ScrollArea className="h-72 w-full rounded-md border border-gray-200 bg-white shadow-sm">
      <div className="flex flex-col space-y-3 p-4">
        {contacts.length > 0 ? (
          contacts.map((contact, index) => (
            <div
              key={contact._id}
              onClick={() => handleChangeChat(index, contact, false)}
              className="flex items-center gap-4 p-3 rounded-md hover:bg-blue-50 transition cursor-pointer border border-gray-100 shadow-sm"
            >
              <img
                src={
                  contact.imagePreview
                    ? contact.imagePreview
                    : typeof contact.image === "string" &&
                      contact.image.startsWith("/uploads")
                    ? `http://localhost:8747${contact.image}`
                    : typeof contact.image === "string"
                    ? contact.image
                    : "/default-avatar.png"
                }
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
              />
              <p className="text-sm font-medium text-gray-800">
                {contact.email}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-sm">No contacts available.</p>
        )}
      </div>
      <ScrollBar />
    </ScrollArea>
  </div>
);

}