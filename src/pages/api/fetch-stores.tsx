import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const stores = await prisma.store.findMany();
    res.status(200).json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the stores' });
  }
}