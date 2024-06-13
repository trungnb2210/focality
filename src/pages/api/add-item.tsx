import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    try {
      const { name, nativeName, price, imageUrl, description, storeId } = request.body;

      if (!name || !storeId) {
        return response.status(400).json({ error: 'Name and storeId are required' });
      }

      const store = await prisma.store.findUnique({
        where: { sid: storeId }
      });
    
      if (!store) {
        throw new Error(`Store with id ${storeId} does not exist.`);
      }

      const newItem = await prisma.item.create({
        data: {
          name,
          nativeName,
          price,
          imageUrl,
          description,
          storeId,
        },
      });

      return response.status(200).json(newItem);
    } catch (error) {
      console.error(error);
      return response.status(500).json({ error: 'An error occurred while adding the item' });
    }
  } else {
    response.setHeader('Allow', ['POST']);
    response.status(405).end(`Method ${request.method} Not Allowed`);
  }
}

