import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { Store } from '../store'

const calculateDistance = async (address1: string, address2: string): Promise<number> => {
    const api_key: string = process.env.GOOGLE_MAP_API_KEY? process.env.GOOGLE_MAP_API_KEY: "";

    const response1 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address1}&key=${api_key}`);
    const data1 = await response1.json();
    const lat1 = data1.results[0]?.geometry?.location?.lat;
    const lon1 = data1.results[0]?.geometry?.location?.lng;

    const response2 = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${address2}&key=${api_key}`);
    const data2 = await response2.json();
    const lat2 = data2.results[0]?.geometry?.location?.lat;
    const lon2 = data2.results[0]?.geometry?.location?.lng;

    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.asin(Math.sqrt(a));

    return R * c;
};

const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const { ingredients, currentLocation } = req.query;

    let ingredientsArray: string[] = [];
    if (typeof ingredients === 'string') {
        try {
            ingredientsArray = JSON.parse(decodeURIComponent(ingredients));
        } catch (error) {
            console.error("Failed to parse ingredients:", error);
        }
    }

    const location = Array.isArray(currentLocation) ? currentLocation[0] : currentLocation;

    const stores = await prisma.store.findMany({
        where: {
            items: {
                some: {
                    OR: ingredientsArray.map(ingredient => ({
                        OR: [
                            { nativeName: { contains: ingredient, mode: 'insensitive' } },
                            { name: { contains: ingredient, mode: 'insensitive' } },
                        ]
                    }))
                },
            },
        },
        include: {
            items: true,
        },
    });

    const storesWithDistance = await Promise.all(stores.map(async store => {
        const distance = await calculateDistance(store.sortcode, location || "");
        const availableItems = store.items.filter(item =>
            ingredientsArray.some(ingredient =>
                item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
            )
        );
        const availableItemsName = availableItems.map(i => i.nativeName ? i.nativeName : i.name);
        const unavailableItems = ingredientsArray.filter(ingredient =>
            !store.items.some(item =>
                item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
                (item.nativeName && item.nativeName.toLowerCase().includes(ingredient.toLowerCase()))
            )
        );
        const matchedIngredients = availableItems.length;
        return { ...store, availableItemsName, matchedIngredients, unavailableItems, distance };
    }));

    const sortedStores = storesWithDistance.sort((a, b) => b.matchedIngredients - a.matchedIngredients);

    res.status(200).json({ stores: sortedStores });
};
