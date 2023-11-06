import React, { useEffect } from "react";
import mapboxgl from "mapbox-gl";
import { mapBoxToken } from "utils/firebase";
import "./Mapbox.scss";

mapboxgl.accessToken = mapBoxToken;

const MapboxMarker = ({ latitude, longitude }) => {
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: "map", // HTML element ID where the map will be rendered
      style: "mapbox://styles/mapbox/streets-v12",
      center: [longitude, latitude], // Set the initial center based on latitude and longitude
      zoom: 16, // Set an initial zoom level
    });

    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        // When active, the map will receive updates to the device's location as it changes.
        trackUserLocation: true,
        // Draw an arrow next to the location dot to indicate which direction the device is heading.
        showUserHeading: true,
      })
    );

    // Create a marker at the specified latitude and longitude
    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    // Clean up the map instance when the component unmounts
    return () => {
      map.remove();
    };
  }, [latitude, longitude]);

  return <div id="map" style={{ width: "100%", height: "300px" }}></div>;
};

export default MapboxMarker;
