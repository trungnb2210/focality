// pages/api/recipes.js
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { nationality } = req.query;
  if (typeof nationality !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }

  try {
    const result = await prisma.nationality.findUnique({
      where: {
        name: nationality
      },
      include: {
        recipes: true,
      }
    });
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ error: 'Error fetching recipes' });
  }
};

export default handler;
