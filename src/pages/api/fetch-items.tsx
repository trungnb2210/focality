import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storeId = req.query.storeId as string; // Ensure storeId is treated as a string
  try {
    const items = await prisma.item.findMany({
      where: {
        storeId: { contains: storeId, mode: "insensitive" }
      },
    });

    res.status(200).json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}
