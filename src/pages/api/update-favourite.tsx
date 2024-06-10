import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === 'POST') {
        try {
            const { userId, recipeId } = request.body

            if (!userId || !recipeId) {
                return response.status(400).json({ error: 'Name and storeId are required' });
            }

            const user = await prisma.user.findUnique({
                where: { uid: userId },
                include: { favouriteRecipes: true }
            });

            if (!user) {
                return response.status(404).json({ message: 'User not found' });
            }

            const isFavourite = user.favouriteRecipes.some(recipe => recipe.rid === recipeId)

            const updatedUser = await prisma.user.update({
                where: {uid: userId},
                data: {
                    favouriteRecipes: {
                        [isFavourite? 'disconnect' : 'connect']: { rid: recipeId }
                    }
                },
                include: { favouriteRecipes: true }
            })

            return response.status(200).json(updatedUser.favouriteRecipes);
        } catch (error) {
            console.error(error);
            return response.status(500).json({ error: 'An error occurred while updating user' });
        }
    } else {
            response.setHeader('Allow', ['POST']);
            response.status(405).end(`Method ${request.method} Not Allowed`);
    }
}

