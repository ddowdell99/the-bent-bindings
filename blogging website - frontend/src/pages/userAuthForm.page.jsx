import React from "react";
import InputBox from "../components/input.component";

const UserAuthForm = ({ type }) => {
  return (
    <section className="h-cover flex items-center justify-center">
      <form className="w-[80%] max-w-[400px]">
        <h1 className="text-4xl capitalize text-center mb-24">
          {type == "sign-in" ? "Welcome Back!" : "Join us today!"}
        </h1>
        {type != "sign-in" ? (
          <InputBox
            name="fullname"
            type="text"
            placeholder="Full Name"
            icon="fi-rr-circle-user"
          />
        ) : (
          ""
        )}{" "}
        <InputBox
          name="email"
          type="email"
          placeholder="Email Address"
          icon="fi-rr-envelope"
        />
        <InputBox
          name="password"
          type="password"
          placeholder="Password"
          icon="fi-rr-lock"
        />
      </form>
    </section>
  );
};

export default UserAuthForm;
