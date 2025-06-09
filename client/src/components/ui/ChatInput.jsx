import React, { useState,useRef } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import Picker from "emoji-picker-react";
import { FiPaperclip } from "react-icons/fi";



export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (emojiObject) => {
    setMsg((prev) => prev + emojiObject.emoji);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0 || file) {
      handleSendMsg(msg, file);
      setMsg("");
      setFile(null);
      setFileName("");
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className="p-3 bg-white rounded-lg shadow-md max-w-xl mx-auto">
      <div className="relative flex items-center mb-2">
        <button
          type="button"
          onClick={handleEmojiPickerhideShow}
          className="text-xl p-2 rounded-full hover:bg-gray-200 transition"
          aria-label="Toggle Emoji Picker"
        >
          <BsEmojiSmileFill />
        </button>
        {showEmojiPicker && (
          <div className="absolute bottom-12 left-0 z-20 shadow-lg rounded-md overflow-hidden">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      <form className="flex items-center gap-2" onSubmit={sendChat}>
        <input
          type="text"
          placeholder="Type your message here..."
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
          className="flex-grow px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <FileUploader onFileSelect={handleFileChange} fileName={fileName} />
        <button
          type="submit"
          className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition shadow-md"
          aria-label="Send Message"
        >
          <IoMdSend size={20} />
        </button>
      </form>
    </div>
  );
}



function FileUploader({ onFileSelect, fileName }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current && fileInputRef.current.click();
  };

  return (
    <div className="flex items-center gap-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        name="file"
        accept="image/*,application/pdf,.doc,.docx"
        onChange={onFileSelect}
        className="hidden"
      />
      {/* Attach button */}
      <button
        type="button"
        className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 transition"
        aria-label="Attach file"
        onClick={handleButtonClick}
      >
        <FiPaperclip size={20} className="text-gray-600" />
      </button>
      {/* File name (if any) */}
      {fileName && (
        <span className="text-xs text-gray-700 truncate max-w-[120px]">{fileName}</span>
      )}
    </div>
  );
}