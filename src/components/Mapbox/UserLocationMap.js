import React, { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { mapBoxToken } from 'utils/firebase';

mapboxgl.accessToken = mapBoxToken;

const UserLocationMap = () => {
    useEffect(() => {
        // Create a new map instance
        const map = new mapboxgl.Map({
          container: 'map', // container ID
          style: 'mapbox://styles/mapbox/streets-v12', // style URL
          center: [123.88037053743659, 10.29551334740033], // starting center in [lng, lat] 
          zoom: 17, // starting zoom
        });
      
        // Add geolocate control to the map.
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
      
        // Add a fixed marker at specific coordinates
        new mapboxgl.Marker()
          .setLngLat([123.88037053743659, 10.29551334740033])
          .addTo(map);
      
        // Clean up when the component unmounts
        return () => {
          map.remove();
        };
      }, []);
      

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
    </div>
  );
};

export default UserLocationMap;
