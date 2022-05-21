import React from "react";
import SignUpForm from "./signUpForm";

interface SignUpWrapProps {}

const SignUpWrap: React.FC<SignUpWrapProps> = ({ children }) => {
  return (
    <>
      <SignUpForm />
    </>
  );
};

export default SignUpWrap;
