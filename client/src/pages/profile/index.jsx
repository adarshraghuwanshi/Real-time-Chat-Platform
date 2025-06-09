import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { profileRoute, updateProfileRoute } from '../../utils/routes';
import Logout from '../../components/ui/Logout';
import { useNavigate, Link } from 'react-router-dom'


const Profile = () => {
  const fileInputRef = useRef(null);
  const Navigate=useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    image: '',
  });
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("chat-app-user"))
        const token = user?.token; 


        if (!token) {
          console.error('No token found in localStorage');
          return;
        }

        const res = await axios.get(profileRoute, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });


      if(!res.data) {
        console.error('No profile data found');
        return;
      }


        const { firstName, lastName, email, password, image } = res.data;
        setFormData({ firstName, lastName, email, password, image });
        console.log('Profile data fetched successfully:', res.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);



  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
       setFormData({
      ...formData,
      image: files[0],
      imagePreview: URL.createObjectURL(files[0]), 
    });
      
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const profileData ={
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      image: formData.image,
    }

      const formDataToSend = new FormData();
  formDataToSend.append('firstName', formData.firstName);
  formDataToSend.append('lastName', formData.lastName);
  formDataToSend.append('email', formData.email);
  formDataToSend.append('password', formData.password);
  if (formData.image) {
    formDataToSend.append('image', formData.image);
  }
  
  console.log("image: " , formData.image)

    try {
        const user = JSON.parse(localStorage.getItem("chat-app-user"))
        const token = user?.token; 

      const res = await axios.put(updateProfileRoute, formDataToSend, {
          headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',

        },
        withCredentials: true,
      });
      alert('Profile updated successfully!');
      
      console.log('Profile send successfully from client:', res.data);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Profile update failed.');
    }
  };

 return (
  <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 px-4">
    
    <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8">

       <div className="flex flex-col items-center gap-3 mb-6">
          <button
            onClick={() => Navigate("/chat")}
            className="w-full bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-3 px-4 rounded-xl shadow transition duration-200 text-lg"
          >
           Click to Start Chatting
          </button>
        </div>
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Update Your Profile
      </h2>

      

      
  <div className="flex justify-center mb-4">
 <img
   src={
    formData.imagePreview
      ? formData.imagePreview
      : (typeof formData.image === 'string' && formData.image.startsWith('/uploads')
          ? `http://localhost:8747${formData.image}`
          : (typeof formData.image === 'string'
              ? formData.image
              : '/default-avatar.png'))
  }
 
  alt="Profile"
  className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
   onClick={() => fileInputRef.current.click()}
/>

  </div>

  
          
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            ref={fileInputRef}
            className=" hidden  w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-blue-100 file:text-blue-700
              hover:file:bg-blue-200"
          />



      <form
        onSubmit={handleSubmit}
        action="profile"
        method="put"
        encType="multipart/form-data"
        className="space-y-5"
      >
        <div>
          <label className="block text-gray-700 font-medium mb-1">
            First Name
          </label>
          <input
            type="text"
            name="firstName"
            onChange={handleChange}
            value={formData.firstName}
            placeholder="Enter your first name"
            className="w-full px-4 py-2 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Last Name
          </label>
          <input
            type="text"
            name="lastName"
            onChange={handleChange}
            value={formData.lastName}
            placeholder="Enter your last name"
            className="w-full px-4 py-2 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-xl shadow-sm border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200"
        >
          Update Profile
        </button>
      </form>

      <div className="mt-6 text-center ">
        <Logout />
      </div>
    </div>
  </div>
);

};

export default Profile;
