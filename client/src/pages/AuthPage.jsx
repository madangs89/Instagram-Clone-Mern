import React, { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../Redux/Services/AuthThunk";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import AuthNav from "../components/Deloper/AuthNav";
import Loader from "../components/Deloper/Loader";
import { arrayBufferTobase64 } from "../utils/utilitity";

const AuthPage = () => {
  const [login, setLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const state = useSelector((state) => state.auth);

  const createTwoPairsOfRsaKeys = async () => {
    const keyPairs = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: { name: "SHA-256" },
      },
      true,
      ["decrypt", "encrypt"]
    );
    let publicKey = await crypto.subtle.exportKey("spki", keyPairs.publicKey);
    let privateKey = await crypto.subtle.exportKey(
      "pkcs8",
      keyPairs.privateKey
    );
    publicKey = arrayBufferTobase64(publicKey);
    privateKey = arrayBufferTobase64(privateKey);

    return { publicKey, privateKey };
  };

  const submitHanlder = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      userName: formData.get("userName"),
    };
    if (login) {
      const loginData = {
        userName: data.userName,
        password: data.password,
      };
      try {
        const resultAction = await dispatch(loginUser(loginData));
        const userData = resultAction.payload;
        if (!userData.success) {
          console.error("Login failed: in auth page", userData.message);
          toast.error(userData.message || "Login failed");
          return;
        }
        toast.success("Login successful");
        navigate("/");
      } catch (err) {
        console.error("Login error:", err);
        toast.error("Login failed, please try again");
      }
    } else {
      try {
        const { publicKey, privateKey } = await createTwoPairsOfRsaKeys();
        console.log(publicKey, privateKey, "keys");
        data.publicKey = publicKey;
        console.log(data, "data");
        localStorage.setItem("privateKey", privateKey);
        const resultAction = await dispatch(registerUser(data));
        const userData = resultAction.payload;
        if (!userData.success) {
          toast.error(userData.message || "Registration failed");
          console.error("Registration failed: in auth page", userData.message);
          return;
        }
        toast.success("Registration successful");
        navigate("/");
      } catch (err) {
        console.error("Registration error:", err);
        toast.error("Registration failed, please try again");
      }
    }
  };
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-[#0e0e0e] px-4 text-white">
      <AuthNav login={login} setLogin={setLogin} />
      <Card className="w-full md:max-w-lg max-w-[350px] bg-[#1f1f1f] border border-[#2a2a2a] rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">
            {login ? "Login to your account" : "Create a new account"}
          </CardTitle>
          <CardDescription>
            {login
              ? "Enter your credentials to log in"
              : "Fill out the form to create an account"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={submitHanlder}>
          <CardContent>
            <div className="flex flex-col gap-3">
              {!login && (
                <>
                  <div className="grid gap-2">
                    <Label className="text-white" htmlFor="email">
                      Email
                    </Label>
                    <Input
                      className="bg-[#2a2a2a] text-white border border-[#3a3a3a]"
                      id="email"
                      type="email"
                      name="email"
                      placeholder="m@example.com"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-white" htmlFor="name">
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      className="bg-[#2a2a2a] text-white border border-[#3a3a3a]"
                      placeholder="JohnDoe"
                      required
                    />
                  </div>
                </>
              )}

              <div className="grid gap-2">
                <Label className="text-white" htmlFor="userName">
                  User Name
                </Label>
                <Input
                  className="bg-[#2a2a2a] text-white border border-[#3a3a3a]"
                  id="userName"
                  type="text"
                  name="userName"
                  placeholder="JohnDoe123"
                  required
                />
              </div>
              <div className="grid my-2 gap-2">
                <div className="flex items-center">
                  <Label className="text-white" htmlFor="password">
                    Password
                  </Label>
                </div>
                <Input
                  placeholder="password"
                  className="bg-[#2a2a2a] text-white border border-[#3a3a3a]"
                  id="password"
                  name="password"
                  type="password"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {state.loading ? (
              <Loader />
            ) : (
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 my-2"
              >
                {login ? "Login" : "Sign Up"}
              </Button>
            )}
            {/* <Button variant="outline" type="button" className="w-full">
              Login with Google
            </Button> */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};
export default AuthPage;
