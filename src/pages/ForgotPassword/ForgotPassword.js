import React, { useState } from "react";
import { Link } from "react-router-dom";
import authService from "../../utils/auth";
import "./ForgotPassword.scss";
import passPotato from "../../images/password-potato.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsSendingEmail(true);
    try {
      await authService.sendResetPasswordEmail(email);
      setMessage("Password reset email has been sent.");
    } catch (err) {
      const slicedMessage = err.message.slice(9);
      setError(slicedMessage);
    } finally {
      setIsSendingEmail(false); 
    }
  };

  return (
    <div className="forgot-password-body">
      <div className="forgot-img-header">
        <img src={passPotato}></img>
      </div>
      <div className="forgot-body">
        <div className="pass-wallet"><h3>WALLET</h3></div>
        <div className="pass-wise">WISE</div>
        <div className="pass-message">
          We will send password reset email below
        </div>
        <div className="form-control">
          <form onSubmit={handleForgotPassword}>
            <input
              type="forgot-email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="forgot-error-message">
              {error && <p>{error}</p>}
            </div>
            {isSendingEmail ? (
              <p className="sending-email-message">
                Sending password reset email..
              </p>
            ) : message ? (
              <p className="forgot-message">{message}</p>
            ) : (
              <button type="forgot-submit">SEND PASSWORD RESET EMAIL</button>
            )}
          </form>
        </div>
        <Link to="/login">
          <div className="login-btn-forgot">
            <button>LOGIN</button>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
