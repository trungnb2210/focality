import React, { useRef, useState, useEffect } from 'react';
import { Autocomplete } from '@react-google-maps/api';

const LocationInput: React.FC<{ onLocationSelect: (location: string) => void }> = ({ onLocationSelect }) => {
    const [address, setAddress] = useState<string>("");
    const [error, setError] = useState<string | null>("Enter Address");
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const londonBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(51.2867602, -0.5103751),
        new google.maps.LatLng(51.6918741, 0.3340155)
    );

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address) {
                setAddress(place.formatted_address);
                setError(null);
                onLocationSelect(place.formatted_address);
            } else {
                setError("No available address");
                console.log("No address available");
            }
        }
    };

    const handleSearchClick = () => {
        if (address.trim() === "") {
            setError("Enter a location");
        } else {
            setError(null);
            onLocationSelect(address);
        }
    };

    useEffect(() => {
        if (autocompleteRef.current) {
            autocompleteRef.current.setBounds(londonBounds);
            autocompleteRef.current.setComponentRestrictions({ country: "uk" });
        }
    }, []);

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
                        required
                        className={`px-4 py-2 rounded-2xl text-lg mb-2 mr-2 ${error ? 'border-red-600 border-2' : 'border-gray-300 border'}`}
                    />
                </Autocomplete>
                <button
                    type="button"
                    onClick={handleSearchClick}
                    className="border-1 border-[#7A9E9F] bg-[#3E3F3B] text-[#EEF5DB] hover:bg-[#7A9E9F] hover:text-[#3E3F3B]
                    rounded-[48px] px-4 py-2"
                >
                    Search
                </button>
            </div>
            {error && <p className="text-red-600 mt-1">{error}</p>}
        </div>
    );
};

export default LocationInput;
