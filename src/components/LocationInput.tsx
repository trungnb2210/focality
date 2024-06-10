import React, { useRef, useState, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import CircularProgress from '@mui/material/CircularProgress';

const LocationInput: React.FC<{ onLocationSelect: (location: string) => void; initialAddress: string }> = ({ onLocationSelect, initialAddress }) => {
    const [address, setAddress] = useState<string>(initialAddress);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const londonBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(51.2867602, -0.5103751),
        new google.maps.LatLng(51.6918741, 0.3340155)
    );

    const reverseGeocode = async (latitude: number, longitude: number) => {
        setLoading(true);
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: { lat: latitude, lng: longitude } }, (results, status) => {
            setLoading(false);
            if (status === 'OK' && results && results[0]) {
                setAddress(results[0].formatted_address);
                setError(null);
                onLocationSelect(results[0].formatted_address);
            } else {
                setError('Unable to find the address for the location.');
                console.error('Geocode was not successful for the following reason: ' + status);
            }
        });
    };

    const fetchCurrentLocation = () => {
        if (navigator.geolocation) {
            setLoading(true);
            navigator.geolocation.getCurrentPosition(position => {
                reverseGeocode(position.coords.latitude, position.coords.longitude);
            }, () => {
                setLoading(false);
                setError('Geolocation is not supported by this browser or user denied access.');
            });
        } else {
            setError('Geolocation is not supported by this browser.');
        }
    };

    useEffect(() => {
        if (!initialAddress) {
            fetchCurrentLocation();
        }
    }, [initialAddress]);

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address) {
                setAddress(place.formatted_address);
                setError(null);
                onLocationSelect(place.formatted_address);
            } else {
                setError("No available address");
            }
        }
    };

    const handleSearchClick = () => {
        if (!address.trim()) {
            setError("Enter a location");
        } else {
            setError(null);
            onLocationSelect(address);
        }
    };

    return (
        <div className="flex flex-col items-start">
            <div className="flex items-center">
                <Autocomplete
                    onLoad={(autocomplete) => {
                        autocompleteRef.current = autocomplete;
                        autocomplete.setBounds(londonBounds);
                        autocomplete.setComponentRestrictions({ country: "uk" });
                    }}
                    onPlaceChanged={handlePlaceChanged}
                >
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter a location"
                        className={`px-4 py-2 rounded-2xl text-lg mb-2 mr-2 ${error ? 'border-red-600 border-2' : 'border-gray-300 border'}`}
                    />
                </Autocomplete>
                <button
                    onClick={handleSearchClick}
                    className="ml-2 py-2 px-4 border border-gray-300 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
                >
                    Search
                </button>
            </div>
            {loading && <CircularProgress size={24} />}
            {error && <p className="text-red-600 mt-1">{error}</p>}
        </div>
    );
};

export default LocationInput;
