import React from "react";
import InputBox from "../components/input.component";

const UserAuthForm = ({ type }) => {
  return (
    <section className="h-cover flex items-center justify-center">
      <form className="w-[80%] max-w-[400px]">
        <h1 className="text-4xl capitalize text-center mb-24">
          {type == "sign-in" ? "Welcome Back!" : "Join us today!"}
        </h1>
        {
            type != "sign-in" ? 
            <InputBox name="fullname"
            type="text"
            placeholder="Full Name"/> : ""
        }
      </form>
    </section>
  );
};

export default UserAuthForm;
