import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createChannels } from "../../utils/routes";

export default function CreateChannel({ contacts }) {
  const [name, setName] = useState("");
  const [members, setMembers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);


  const toggleMember = (userId) => {
    setMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const filteredContacts = contacts.filter((contact) =>
    `${contact.firstName} ${contact.lastName} ${contact.email}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
const createChannel = async () => {
  if (!name.trim() || members.length === 0) {
    alert("Please enter a channel name and select at least one member.");
    return;
  }
  setLoading(true);
  try {
    const token = JSON.parse(localStorage.getItem("chat-app-user"))?.token;
    if (!token) {
      console.error("No token found in localStorage");
      setLoading(false);
      return;
    }

    const response = await axios.post(createChannels,
      { name, members },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    if (response.status === 201) {
      alert("Channel created successfully!");
      setName("");
      setMembers([]);
      setSearchTerm("");
      setShowDropdown(false);
      setOpen(false);  

    } else {
      alert("Failed to create channel. Please try again.");
    }
  } catch (error) {
    console.error("Error creating channel:", error);
    alert("An error occurred while creating the channel.");
  } finally {
    setLoading(false);
  }


}
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
    <Button variant="outline">Create Channel</Button>
    </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Channel</DialogTitle>
          <DialogDescription>
            Select a name and members for your channel.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-4">
          <Input
            placeholder="Channel Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="relative">
            <Input
              placeholder="Add Members"
              onFocus={() => setShowDropdown(true)}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            {showDropdown && (
              <ScrollArea className="absolute z-10 bg-white border rounded w-full max-h-40 mt-1 overflow-y-auto">
                {filteredContacts.length === 0 ? (
                  <div className="p-2 text-sm text-gray-500">No contacts found</div>
                ) : (
                  filteredContacts.map((contact) => (
                    <div
                      key={contact._id}
                      onClick={() => toggleMember(contact._id)}
                      className={`p-2 cursor-pointer hover:bg-blue-100 ${
                        members.includes(contact._id) ? "bg-blue-200" : ""
                      }`}
                    >
                      {contact.firstName} {contact.lastName} ({contact.email})
                    </div>
                  ))
                )}
              </ScrollArea>
            )}
          </div>

          {members.length > 0 && (
            <div className="text-sm text-gray-600">
              <p className="font-semibold mb-1">Selected Members:</p>
              <ul className="list-disc ml-4">
                {members.map((id) => {
                  const user = contacts.find((u) => u.userId === id);
                  return (
                    <li key={id}>
                      {user?.firstName} {user?.lastName} ({user?.email})
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <Button disabled={loading} className="bg-blue-500 text-white" onClick={createChannel}>
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
