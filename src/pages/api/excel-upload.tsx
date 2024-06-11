import { NextApiRequest, NextApiResponse } from 'next';
import { createOrUpdateItem } from '../../../lib/prisma';
import { Item2 } from '../storeside';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
      try {
        const items: Item2[] = req.body;
        console.log(JSON.stringify(items));
        if (!Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ error: 'Invalid data' });
        }
  
        // Process each item
        for (const item of items) {
            const { name, nativeName, price, imageUrl, description, storeId } = item;
            await createOrUpdateItem(name, nativeName, price, imageUrl, description, storeId);
        }
  
        res.status(200).json({ message: 'Items added or updated successfully' });
      } catch (error) {
        console.error('Error processing data:', error);
        res.status(500).json({ error: 'Error processing data' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }