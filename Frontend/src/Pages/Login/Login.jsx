import React, { useRef } from "react";
import InputBox from "../../Components/InputBox";
import Button from "../../Components/Button";
import { MoveRight } from "lucide-react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { FetchData } from "../../Utility/FetchFromApi";

const Login = () => {
  const Navigate = useNavigate();

  const NavigateRegister = () => {
    Navigate("/register");
  };

  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await FetchData("users/login", "post", formData);
      console.log(response);
      if (response.data.success) {
        setSuccess("Login successful!");
        Navigate("/");
        
      } else {
        // const result = await response.json();
        setError(result.message || "Login failed");
      }
    } catch (err) {
      setError("An error occurred during login.");
    }
  };

  return (
    <div>
      <section className="flex m-28 border rounded-lg shadow-md shadow-neutral-300 h-96 ">
        <div className="w-1/2 p-10 rounded-lg rounded-r-none headerBg text-white">
          <h1 className="text-4xl h-3/4 text-white font-semibold">
            Login with your mobile number to get started !
          </h1>
          <h1 className="flex justify-around items-center">
            If you are not registered with us create your new account here{" "}
            <MoveRight />
          </h1>
        </div>
        <div className=" w-1/2 flex justify-center items-center flex-col whiteSoftBG">
          <form
            ref={formRef}
            className="login h-3/4 flex justify-top items-top flex-col w-3/4"
          >
            <InputBox
              onChange={handleChange}
              LabelName={"Login"}
              Placeholder={"Email Address"}
              Type={"email"}
              className={"w-full"}
              Name={"email"}
              Value={formData.email}
            />
            <InputBox
              onChange={handleChange}
              LabelName={"Password"}
              Placeholder={"Password"}
              Type={"password"}
              className={"w-full"}
              Name={"password"}
              Value={formData.password}
            />
            {/* <InputBox
              LabelName={"Login"}
              Placeholder={"Your Mobile Number"}
              Type={"number"}
              className={"w-full"}
            /> */}
            <Button
              label={"Login"}
              className={"w-full"}
              onClick={handleSubmit}
            />
          </form>
          <div className="w-full h-full justify-center items-center flex flex-col">
            <Button
              label={"Register Here"}
              onClick={NavigateRegister}
              className={"w-1/2 hover:bg-green-500"}
            />
            <p className="text-xs text-neutral-500">
              ** By continuing, you agree to our Terms of Use and Privacy
              Policy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
