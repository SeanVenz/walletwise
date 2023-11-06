// MapboxMap.js
import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { mapBoxToken } from "utils/firebase";
import "./Mapbox.scss";

mapboxgl.accessToken = mapBoxToken;

const MapboxMap = ({ setLatitude, setLongitude, onClose }) => {
  const [map, setMap] = useState(null);
  const [activeMarker, setActiveMarker] = useState(null);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: [123.88037053743659, 10.29551334740033],
        zoom: 16, // Default zoom
      });

      mapInstance.on("load", () => {
        setMap(mapInstance);
      });

      return () => {
        if (mapInstance) {
          mapInstance.remove();
        }
      };
    };

    initializeMap();
  }, []);

  useEffect(() => {
    if (map) {
      map.on("click", handleMapClick);
    }

    return () => {
      if (map) {
        map.off("click", handleMapClick);
      }
    };
  }, [map]);

  const handleMapClick = (e) => {
    if (map) {
      const { lng, lat } = e.lngLat;

      if (activeMarker) {
        activeMarker.remove();
      }

      const newMarker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);

      setActiveMarker(newMarker);

      setLatitude(lat);
      setLongitude(lng);
    }
  };

  return (
    <div className="map-container">
      {/* <button
        className="map-close-button"
        style={{ marginTop: "0px" }}
        onClick={onClose}
      >
        Close
      </button> */}
      <div id="map" style={{ width: "100%", height: "300px" }} />
    </div>
  );
};

export default MapboxMap;
