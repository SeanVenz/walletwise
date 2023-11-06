import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../utils/auth";
import "./SignUp.scss";
import MapboxMap from "components/Mapbox/Mapbox";
import candyPotato from "../../images/candy-potato.png";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [role, setRole] = useState("student"); // Default role is student
  const [idNumber, setIdNumber] = useState("");
  const [storeName, setStoreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const idOrStoreName = role === "vendor" ? storeName : idNumber;

      const roleSpecificData = role === "vendor" ? { latitude, longitude } : {};

      role === "vendor"
        ? await authService.signUpVendor(
            email,
            password,
            fullName,
            idOrStoreName,
            selectedImage,
            phoneNumber,
            role,
            roleSpecificData.latitude,
            roleSpecificData.longitude,
          )
        : await authService.signUp(
            email,
            password,
            fullName,
            idOrStoreName,
            phoneNumber,
            role
          );

      setIsSubmitting(false);
      navigate("/verify-email");
    } catch (err) {
      setIsSubmitting(false);
      const slicedMessage = err.message.slice(9);
      setError(slicedMessage);
    }
  };

  const handleMapClose = (e) => {
    e.stopPropagation(); 
    setShowMap(false); 
  };

  const handleOpenMap = () => {
    setShowMap(true); 
  };

  const handleCloseMap = () => {
    setShowMap(false); 
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile); 
  };

  return (
    <div className="signup-parent">
      <div className="potato-box">
        <img src={candyPotato} alt="Potato" />
      </div>
      <div className="bg-holder">
        <div className="signup-txtbox">
          <div className="signup-txtbox2">WALLET</div>
          <div className="signup-txtbox3">WISE</div>
        </div>
        <div className="signup-form">
          <form onSubmit={handleSignUp}>
            <input
              className="signup-text"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            {role === "student" ? (
              <input
                className="signup-text"
                type="text"
                placeholder="ID Number"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
              />
            ) : (
              <input
                className="signup-text"
                type="text"
                placeholder="Store Name"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            )}
            <input
              className="signup-text"
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <input
              className="signup-text"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="signup-text"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {role === "vendor" && (
              <div className="input-img">
                <label>
                  Store Image:
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    onChange={handleImageChange}
                    required
                  />
                </label>
              </div>
            )}
            <div>
              <label>
                Role:
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="student">Student</option>
                  <option value="vendor">Vendor</option>
                </select>
              </label>
            </div>
            <div className="signup-submit"></div>
            
            <div className="error-message">{error && <p>{error}</p>}</div>
            {isSubmitting ? (
              <div className="success-message">
                <h3>Signing up... </h3>
              </div>
            ) : (
              <div className="signup-button">
              <button
                style={{ top: "0px", padding: "15px 32px", zIndex: "4" }}
                type="signup-submit"
              >
                Sign up
              </button></div>
            )}
          </form>
          <div className="signup-map">
            {role === "vendor" && (
              <div>
                {/* Toggle the map visibility */}
                <button className="open-map" onClick={handleOpenMap}>
                  Open Map
                </button>
                {/* Show the Map Modal */}
                {showMap && (
                  <div className="signup-modal">
                    <div className="signup-modal-content">
                      <MapboxMap
                        setLatitude={setLatitude}
                        setLongitude={setLongitude}
                      />
                      <button className="close-modal" onClick={handleCloseMap}>
                        Close Map
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
