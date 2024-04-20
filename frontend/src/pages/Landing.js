import React, { useState, useEffect, useRef } from "react";
import { L } from "../components/auth/L";
import { S } from "../components/auth/S";
import gsap from "gsap";

export const Landing = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const headingRef = useRef(null);
  const loginButtonRef = useRef(null);
  const signupButtonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      loginButtonRef.current,
      { x: "0%", opacity: 1 },
      { duration: 1, x: "0%", opacity: 1, ease: "power4.out" },
      
    )
      .fromTo(
        signupButtonRef.current,
        { x: "150%", opacity: 0 },
        { duration: 1, x: "0%", opacity: 1, ease: "power4.out" },
        "-=0.5" // Delay signup animation slightly
      );

    tl.to(headingRef.current, { duration: 0.5, scale: 1.1 })
      .to(headingRef.current, { duration: 0.5, scale: 1 });

    return () => {
      tl.kill();
    };
  }, []);

  const handleLoginClick = () => {
    setShowLogin(true);
    setShowSignup(false); // Make sure signup is closed when login is opened
  };

  const handleSignupClick = () => {
    setShowSignup(true);
    setShowLogin(false); // Make sure login is closed when signup is opened
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 ref={headingRef} className="font-bold text-2xl mt-6">
        WELCOME TO IDX
      </h1>

      <div className="flex flex-col justify-center items-center mt-6 border border-rounded rounded-lg w-[40%] p-10">
        <div className="flex flex-row">
          <button
            ref={loginButtonRef}
            onClick={handleLoginClick}
            className="btn btn-outline btn-info"
          >
            Login
          </button>
          <button
            ref={signupButtonRef}
            onClick={handleSignupClick}
            className="btn btn-outline btn-error"
          >
            Signup
          </button>
        </div>

        {showLogin && <L />}
        {showSignup && <S />}
      </div>
    </div>
  );
};
