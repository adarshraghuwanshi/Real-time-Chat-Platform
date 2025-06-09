
import axios from "axios";
import { useState, useEffect} from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginRoute, signupRoute } from "../../utils/routes";
import { useNavigate } from "react-router-dom";
import { use } from "react";
export default function AuthForm() {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({ email: "", password: "", confirm: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("chat-app-user"));
    if (user) {
      navigate("/chat");
    }
  },[]);
  

  function loginSetup(e) {
    e.preventDefault();
    const response = axios.post(loginRoute, {
      email: loginData.email,
      password: loginData.password,
    });

    response
      .then((res) => {
        if (res.data.status === false) {
          alert(res.data.msg);
        } else {
          localStorage.setItem("chat-app-user", JSON.stringify( res.data));
          
          console.log("User logged in successfully:", res.data);
          // window.location.href = "/chat";
          navigate ('/chat')
          
        }
      }

    )
      .catch((err) => {
        console.error(err);
        alert("An error occurred while logging in.");
      });
    
   
  }

  function signupSetup(e) {
    e.preventDefault();
    if (signupData.password !== signupData.confirm) {
      alert("Passwords do not match");
      return;
    }
    const response = axios.post(signupRoute, {
      email: signupData.email,
      password: signupData.password,
    });
    response
      .then((res) => {
        if (res.data.status === false) {
          alert(res.data.msg);
        } else {
          localStorage.setItem("chat-app-user", JSON.stringify(res.data.user));
          window.location.href = "/chat";
        }
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while signing up.");
      });
  }


  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
        <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw]'>
          <div className='flex flex-col items-center justify-center h-full mr-100 ml-100'>

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            Welcome <span>✌️</span>
          </h1>
          <p className="text-gray-600">Fill in the details to get started with the best chat app!</p>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full flex mb-4 border-b">
            <TabsTrigger value="login" className="flex-1">Login</TabsTrigger>
            <TabsTrigger value="signup" className="flex-1">Signup</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form className="space-y-4" onSubmit={loginSetup}>
              <Input

                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                className="rounded-full"
              />
              <Input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                className="rounded-full"
              />
              <Button className="w-full rounded-full bg-black text-white">Login</Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form className="space-y-4" onSubmit={signupSetup}>
              <Input
                type="email"
                placeholder="Email"
                value={signupData.email}
                onChange={e => setSignupData({ ...signupData, email: e.target.value })}
                className="rounded-full"
              />
              <Input
                type="password"
                placeholder="Password"
                value={signupData.password}
                onChange={e => setSignupData({ ...signupData, password: e.target.value })}
                className="rounded-full"
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                value={signupData.confirm}
                onChange={e => setSignupData({ ...signupData, confirm: e.target.value })}
                className="rounded-full"
              />
              <Button className="w-full rounded-full bg-black text-white">Signup</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </div>
  );
}
