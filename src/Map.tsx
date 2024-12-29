import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { useEffect, useState } from 'react';

const GREENWICH_LOCATION = { latitude: 51.4934, longitude: 0.0098 };

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const containerStyle = {
    width: '400px',
    height: '400px',
}

const getUserLocation = (setCenterPosition: (position: { latitude: number; longitude: number }) => void) => {
    if (navigator.geolocation) {
        console.log("getting user location");
        navigator.geolocation.getCurrentPosition((position) => {
            console.log("user location", position);
            setCenterPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude });
        }, (error) => {
            console.error("error getting user location", error);
            setCenterPosition(GREENWICH_LOCATION);
        });
    } else {
        console.log("default user location");
        // by default center the map at greenwich, england - 51.4934° N, 0.0098° E
        setCenterPosition(GREENWICH_LOCATION);
    }
}

export const MapContainer = () => {
    // default center the map at greenwich, england - 51.4934° N, 0.0098° E
    const [centerPosition, setCenterPosition] = useState<{ latitude: number; longitude: number } | null>(null);

    console.log("centerPosition", centerPosition);

    // useeffect to call getUserLocation exactly once
    useEffect(() => {
        getUserLocation(setCenterPosition);
    }, []);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: googleMapsApiKey,
    })

    return isLoaded && centerPosition ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            zoom={1}
            onLoad={(map) => {
                const bounds = new window.google.maps.LatLngBounds({ lat: centerPosition.latitude, lng: centerPosition.longitude })
                map.fitBounds(bounds)
            }}
            onUnmount={(map) => {
                // do your stuff before map is unmounted
              }}
        >
            {/* Child components, such as markers, info windows, etc. */}
            <></>
        </GoogleMap>
    ) : (
        <>Loading...</>
    )
};
