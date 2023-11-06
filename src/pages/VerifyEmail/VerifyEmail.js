import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import "./Verify.scss";
import potatoImg from "../../images/potato-support.png";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      const user = authService.getCurrentUser();
      if (user && user.emailVerified) {
        // User's email is verified, navigate to the login page.
        navigate("/login");
      }
      // If the email is not verified, you can handle it as needed.
    };
    checkAuthAndNavigate();
  }, [navigate]);

  const resendEmail = async () => {
    try {
      setIsSubmitting(true);
      setError(null);
      const user = authService.getCurrentUser();
      if (user && !user.emailVerified) {
        await authService.sendVerificationEmail(user);
        setIsSubmitting(false);
        setEmailSent(true);
      }
    } catch (error) {
      const slicedMessage = error.message.slice(9);
      setError(slicedMessage);
      setIsSubmitting(false);
    }
  };

  return (
    <div id="verify" className="verify-parent">
      <div className="potato-box">
        <img src={potatoImg} alt="Potato Logo" />
      </div>
      <div className="verify-right">
        <div className="verify-words">
          <div className="verify-wallet">WALLET</div>
          <div className="verify-wise">WISE</div>
        </div>
        <div className="message">
          {emailSent ? (
            <p>Verification email sent</p>
          ) : (
            <p>We've sent a verification link to your email</p>
          )}
        </div>
        <div className="verify-message-parent">
          <div className="message-verify">
            <p>
              After verifying your email, admins will still check your data
              before you can fully use our app. We will send another email if
              your details are all valid.
            </p>
          </div>
        </div>
        <div className="button">
          {isSubmitting ? (
            <div className="submitting-message">
              <h3>Sending Verification Email...</h3>
            </div>
          ) : emailSent ? (
            <div className="success-message-verify"></div>
          ) : (
            <button className="verify-message" onClick={resendEmail}>
              Resend Verification Email
            </button>
          )}
        </div>

        <Link to="/login">
          <div className="login-btn-forgot">
            <button onClick={authService.logOut}>LOGIN</button>
          </div>
        </Link>
        <div className="error-message-verify">{error && <p>{error}</p>}</div>
      </div>
    </div>
  );
};

export default VerifyEmail;
