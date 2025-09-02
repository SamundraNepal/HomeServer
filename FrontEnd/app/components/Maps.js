import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import { useEffect, useState } from 'react';

export default function MapLocation({ latRef, lanRef, latCod, lanCod }) {
  const [suburb, setSuburb] = useState('Loading...');
  let lat = 0;
  let lan = 0;

  // Component to change map focus based on new position
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

  if (latRef != 'Missing' && latRef !='Unknown') {
    const lanDegree = lanCod[0][0];
    const lanMin = lanCod[1][0] / 60;
    const lanSeconds = lanCod[2][0] / lanCod[2][1] / 3600;
    const lanDirection = lanRef[0];

    const latDegree = latCod[0][0];

    const latMin = latCod[1][0] / 60;
    const latSeconds = latCod[2][0] / latCod[2][1] / 3600;
    const latDirection = latRef[0];

    lat =
      latDirection === 'S' || latDirection === 'W'
        ? (Number(latDegree) + latMin + latSeconds).toFixed(3) * -1
        : (Number(latDegree) + latMin + latSeconds).toFixed(3);

    lan =
      lanDirection === 'S' || lanDirection === 'W'
        ? (Number(lanDegree) + lanMin + lanSeconds).toFixed(3) * -1
        : (Number(lanDegree) + lanMin + lanSeconds).toFixed(3);
  }
  const position = [lat, lan];

  // Reverse Geocoding with Nominatim
  useEffect(() => {
    const fetchSuburb = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lan}&format=json`
        );
        const address = await response.json();
        setSuburb(
          address.address.suburb + ' ' + address.address.city ||
            'Unknown location'
        );
      } catch (error) {
        setSuburb('Location not found');
      }
    };
    fetchSuburb();
  }, [lat, lan]);

  return (
    <MapContainer
      center={position}
      zoom={20}
      scrollWheelZoom={false}
      className="h-full w-full"
      style={{ height: '200px', width: '100wh' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup className="font-bold">Location : {suburb}</Popup>
      </Marker>
      <MapFocus position={position} />
    </MapContainer>
  );
}
