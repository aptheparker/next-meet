"use client";
import { ReactNode, useEffect, useRef, useState } from "react";
import LoginForm from "./LoginForm";
import { existingUserCheck, registerNextMeetUser } from "@/lib/functions/CRUD";
import isFormValid from "@/lib/functions/isFormValid";
import { signIn, signOut, useSession } from "next-auth/react";

const className_button = "w-60 p-6 py-3 bg-[#ffadad] rounded-xl text-white";

const Login = (): ReactNode => {
  //useSession

  //useState
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  //useRefs
  const nameInputRef = useRef<HTMLInputElement>(null);
  const idInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);
  const pwcInputRef = useRef<HTMLInputElement>(null);
  //useEffects

  //data
  const ERROR_MESSAGE = {
    0: "",
    1: "동일한 아이디가 존재합니다.",
    2: "동일한 이메일이 존재합니다.",
    3: "이름이 너무 짧습니다",
    4: "아이디가 너무 짧습니다.",
    5: "비밀번호가 너무 짧습니다.",
    6: "이메일 형식이 옳지 않습니다.",
    7: "비밀번호가 일치하지 않습니다.",
    8: "아이디를 입력하세요.",
    9: "비밀번호를 입력하세요.",
    10: "아이디 혹은 비밀번호가 틀렸습니다.",
  };
  //functions
  const resetForm = () => {
    if (
      !(
        nameInputRef.current &&
        idInputRef.current &&
        pwInputRef.current &&
        emailInputRef.current &&
        pwcInputRef.current
      )
    )
      return;

    nameInputRef.current.value = "";
    idInputRef.current.value = "";
    emailInputRef.current.value = "";
    pwInputRef.current.value = "";
    pwcInputRef.current.value = "";
  };

  const onLoginHandler = async () => {
    if (!(idInputRef.current && pwInputRef.current)) return;
    const loginID = idInputRef.current.value;
    const password = pwInputRef.current.value;

    let errorNo = isFormValid("login", loginID, "", "", password, "");
    if (errorNo !== 0) {
      setError(ERROR_MESSAGE[errorNo as 8 | 9]);
      return;
    }
    try {
      const res = await signIn("credentials", {
        loginID,
        password,
        redirect: false,
      });
      if (res && +res.error! != 0) {
        setError(ERROR_MESSAGE[10]);
      }
    } catch (error) {
      console.error("error:", error);
    }
  };

  const onRegisterHandler = async () => {
    if (
      !(
        nameInputRef.current &&
        idInputRef.current &&
        pwInputRef.current &&
        emailInputRef.current &&
        pwcInputRef.current
      )
    )
      return;

    const userName = nameInputRef.current.value;
    const loginID = idInputRef.current.value;
    const email = emailInputRef.current.value;
    const password = pwInputRef.current.value;
    const passwordCheck = pwcInputRef.current.value;

    //test input validity
    let errorNo = isFormValid(
      "register",
      userName,
      loginID,
      email,
      password,
      passwordCheck
    );
    if (errorNo !== 0) {
      setError(ERROR_MESSAGE[errorNo as 3 | 4 | 5 | 6 | 7]);
      return;
    }
    try {
      const errorNo = await existingUserCheck(loginID!, email!);
      if (errorNo !== 0) {
        setError(ERROR_MESSAGE[errorNo as 1 | 2]);
        return;
      }
    } catch (error) {
      console.log(error);
    }
    await registerNextMeetUser(userName, loginID, email, password);
    resetForm();
    setIsRegistering(false);
  };

  return (
    <div className="w-screen">
      {isLoggingIn && (
        <div className="flex flex-col items-center mb-10">
          <p className="h-4 m-4 text-md text-red-400">{error}</p>
          <LoginForm
            isRegistering={isRegistering}
            nameRef={nameInputRef}
            idRef={idInputRef}
            emailRef={emailInputRef}
            pwRef={pwInputRef}
            pwcRef={pwcInputRef}
            resetError={() => setError("")}
          />
          <button
            className="mt-6 text-sm underline underline-offset-[6px] cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setIsRegistering((prev) => !prev);
            }}
          >
            {isRegistering ? "back to login" : "quick register"}
          </button>
        </div>
      )}
      <div className="flex flex-col items-center text-center gap-3">
        {isLoggingIn ? (
          <button
            className={`${className_button}`}
            onClick={isRegistering ? onRegisterHandler : onLoginHandler}
          >
            {isRegistering ? "Register" : "Login"}
          </button>
        ) : (
          <>
            <p>or</p>
            <button
              className={`${className_button} py-2`}
              onClick={(e) => {
                e.preventDefault();
                setIsLoggingIn(true);
              }}
            >
              Login with Email
            </button>
          </>
        )}
        <button
          className={`${className_button} py-2`}
          onClick={(e) => {
            e.preventDefault();
            signIn("google", { callbackUrl: "/" }, { prompt: "select_account" });
          }}>
          Login with Google
        </button>
        <p>to browse your events.</p>
        <button
          className={`${className_button} py-2`}
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Login;
