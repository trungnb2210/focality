import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { parse } from 'json2csv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storeId = req.query.storeId as string;
  try {
    const items = await prisma.item.findMany({
      where: {
        storeId: { contains: storeId, mode: "insensitive" }
      },
    });

    const fields = [
      'name',
      'nativeName',
      'price',
      'imageUrl',
      'description',
    ];

    const csv = parse(items, { fields });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=items.csv');
    
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}
