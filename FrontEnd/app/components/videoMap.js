'use client';

import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useEffect, useState } from 'react';

export default function VideoMapLocation({ imageDetails }) {
  const [suburb, setSuburb] = useState('Loading...');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [latDirection, setLatDirection] = useState(null);
  const [longDirection, setLongDirection] = useState(null);
  const [lat, setLat] = useState(0);
  const [lan, setLan] = useState(0);

  function conversionData(degree, min, sec, dir) {
    return dir === 'S' || dir === 'W'
      ? (Number(degree) + Number(min / 60) + Number(sec / 3600)).toFixed(3) * -1
      : (Number(degree) + Number(min / 60) + Number(sec / 3600)).toFixed(3);
  }

  useEffect(() => {
    function handleGpsLocation() {
      if (imageDetails.gPSLatitudeAndLongitude != '00000S 00000N') {
        const latSplit = imageDetails.gPSLatitudeAndLongitude.split(',')[0];
        const longSplit = imageDetails.gPSLatitudeAndLongitude.split(',')[1];

        console.log(longSplit);
        setLatitude(latSplit.match(/\d+(\.\d+)?/g));
        setLongitude(longSplit?.match(/\d+(\.\d+)?/g));

        setLatDirection(latSplit.match(/[a-zA-Z]+/g)[1]);
        setLongDirection(longSplit?.match(/[a-zA-Z]+/g)[1]);
      } else {
        setLan(0);
        setLat(0);
        setSuburb('UnKnown Location');
      }
    }
    handleGpsLocation();
  }, [imageDetails]);

  useEffect(() => {
    if (latitude && longitude) {
      setLat(
        conversionData(latitude[0], latitude[1], latitude[2], latDirection)
      );
      setLan(
        conversionData(longitude[0], longitude[1], longitude[2], longDirection)
      );
    }
  }, [latitude, longitude]);

  function MapFocus({ position }) {
    const map = useMap();

    useEffect(() => {
      if (position) {
        map.setView(position, map.getZoom(), {
          animate: true, // Smooth zoom animation
        });
      }
    }, [position, map]);

    return null;
  }

  // Reverse Geocoding with Nominatim
  useEffect(() => {
    if (lat && lan) {
      const fetchSuburb = async () => {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lan}&format=json`
          );
          const data = await response.json();

          if (data && data.address) {
            setSuburb(
              data.address.suburb || data.address.city || 'Unknown location'
            );
          } else {
            setSuburb('Unknown location');
          }
        } catch (error) {
          setSuburb('Location not found');
        }
      };

      fetchSuburb();
    }
  }, [lat, lan]);
  const position = [lat, lan];

  return (
    <MapContainer
      center={position}
      zoom={20}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ height: '150px', width: '100wh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup className="font-bold">Location:{suburb}</Popup>
      </Marker>
      <MapFocus position={position} />
    </MapContainer>
  );
}
