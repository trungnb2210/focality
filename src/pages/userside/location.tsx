// pages/client/LocationPage.tsx
"use client";

import React, { useRef, useState } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { Loader } from '@googlemaps/js-api-loader';
import { GetServerSideProps } from 'next';
import "@/app/globals.css"
import NavBar from '@/components/NavBar';

const libraries: Loader["libraries"] = ["places"];

interface LocationPageProps {
    ingredientsList: string[];
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { ingredients } = context.query;

    let ingredientArray: string[] = [];
    if (typeof ingredients === 'string') {
        ingredientArray = [ingredients];
    } else if (Array.isArray(ingredients)) {
        ingredientArray = ingredients;
    }

    return {
        props: {
            ingredientsList: ingredientArray,
        },
    };
};

const LocationPage: React.FC<LocationPageProps> = ({ ingredientsList }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: "AIzaSyAZQITL5AWcrnNWaeh_zQpllcI-5fPGmC4", // Make sure this is secured in production environments
        libraries,
    });

    const [address, setAddress] = useState<string>("");
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

    const handlePlaceChanged = () => {
        if (autocompleteRef.current) {
            const place = autocompleteRef.current.getPlace();
            if (place.formatted_address) {
                setAddress(place.formatted_address);
                console.log(place.formatted_address);
            } else {
                console.log("No address available");
            }
        }
    };

    if (!isLoaded) return <div>Loading...</div>;

    return (
        <div>
            <NavBar brandName={'Location'}></NavBar>
            <div className="flex flex-col items-center">
                <h1 className="text-xl font-semibold mb-5">Enter Your Location</h1>
                <form
                    action="/store"
                    method="get"
                    onSubmit={(e) => {
                        if (!address) {
                            e.preventDefault(); // Prevent form submission if address is empty
                        }
                    }}
                    className="flex flex-col items-center"
                >
                    <Autocomplete
                        onLoad={(autocomplete) => autocompleteRef.current = autocomplete}
                        onPlaceChanged={handlePlaceChanged}
                    >
                        <input
                            type="text"
                            name="currentLocation"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter a location"
                            required
                            className="px-6 py-2 rounded-lg text-lg mb-6"
                        />
                    </Autocomplete>
                    {ingredientsList.map((ingredient, index) => (
                        <input key={index} type="hidden" name="ingredients" value={ingredient} />
                    ))}
                    <button type="submit" className="border-1 border-[#7A9E9F] bg-[#3E3F3B] text-[#EEF5DB] hover:bg-[#7A9E9F] hover:text-[#3E3F3B]
                    rounded-[48px] flex-grow px-10 h-[44px] py-[14px] items-center flex justify-center">
                        Go to Store Page
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LocationPage;
