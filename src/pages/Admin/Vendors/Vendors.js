import React, { useEffect, useState } from "react";
import {
  approveVendor,
  deleteDocRef,
  getAllUnverifiedVendors,
} from "utils/utils";
import "./Vendors.scss";
import { auth } from "utils/firebase";
import { useNavigate } from "react-router-dom";
import MapboxMarker from "components/Mapbox/MapBoxMarker";
import { emailDecision } from "utils/contact";

function Vendors() {
  const [unverifiedVendors, setUnverifiedVendors] = useState([]);
  const navigate = useNavigate();
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    const fetchUnverifiedVendors = async () => {
      try {
        const vendors = await getAllUnverifiedVendors();
        setUnverifiedVendors(vendors);
      } catch (error) {
        console.error("Error fetching unverified vendors:", error);
      }
    };
    fetchUnverifiedVendors();
  }, []);

  const handleApprovalAndEmail = async (vendor) => {
    try {
      const decisionMessage =
        "Your Wallet Wise application has been approved. You may now use our application. Thank you for signing up.";
      emailDecision(vendor, decisionMessage);

      // Then, approve the vendor
      await approveVendor(vendor.id);

      // Remove the approved vendor from the unverified vendors list
      setUnverifiedVendors((prevVendors) =>
        prevVendors.filter((v) => v.id !== vendor.id)
      );  
    } catch (error) {
      console.error("Error approving and sending email:", error);
    }
  };

  const handleRejectionEmail = async (vendor) => {
    try {
      // Send the rejection email
      const decisionMessage =
        "Your Wallet Wise application has been denied. Data that you entered may be incorrect. Please try signing up again.";
      emailDecision(vendor, decisionMessage);

      deleteDocRef(vendor);

      // Remove the rejected vendor from the unverified vendors list
      setUnverifiedVendors((prevVendors) =>
        prevVendors.filter((v) => v.id !== vendor.id)
      );
    } catch (error) {
      console.error("Error sending rejection email:", error);
    }
  };

  const handleLogOut = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleOpenMap = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  return (
    <div className="admin-vendors">
      <div className="header">
        <h1>Unverified Vendors</h1>
        <button onClick={handleLogOut}>Logout</button>
      </div>
      {unverifiedVendors && unverifiedVendors.length > 0 ? (
        <div className="card-container">
          {unverifiedVendors.map((vendor) => (
            <div className="vendor-card" key={vendor.id}>
              <div className="card-header">
                <h2>{vendor.displayName}</h2>
              </div>
              <div className="card-body">
                <div className="details">
                  <p>Store Name: {vendor.idNumber}</p>
                  <p>Phone Number: {vendor.phoneNumber}</p>
                  <p>Store Image:</p>
                </div>
                <img src={vendor.imageUrl} alt="Location" />
                <div>
                  <div className="vendor-map">
                    <button className="open-map" onClick={handleOpenMap}>
                      Open Map
                    </button>
                    {showMap && (
                      <div className="signup-modal">
                        <div className="signup-modal-content">
                          <MapboxMarker
                            latitude={vendor.latitude}
                            longitude={vendor.longitude}
                          />
                          <button
                            className="close-modal"
                            onClick={handleCloseMap}
                          >
                            Close Map
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="decision-buttons">
                  <button onClick={() => handleRejectionEmail(vendor)}>
                    Reject
                  </button>
                  <button onClick={() => handleApprovalAndEmail(vendor)}>
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h1>No Vendors Yet</h1>
      )}
    </div>
  );
}

export default Vendors;
