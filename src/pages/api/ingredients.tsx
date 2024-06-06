import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';

export interface Item {
    iid: string;
    name: string;
    nativeName?: string;
    price: number;
    imageUrl: string;
    description?: string;
    storeId: string;
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { ingredient } = req.query;
  if (typeof ingredient !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameter' });
  }


  try {
    const results = await prisma.item.findMany({
      where: {
        OR: [
          { name: { contains: ingredient, mode: "insensitive" } },
          { nativeName: { contains: ingredient, mode: "insensitive" } },
          { description: { contains: ingredient, mode: "insensitive" } }
        ]
      },
      select: {
        iid: true,
        name: true,
        nativeName: true,
        price: true,
        imageUrl: true,
        description: true,
        storeId: true,
      }
    });


    const itemMap = new Map();
    results.forEach(item => {
        let n = item.nativeName? item.nativeName: item.name;
        if (itemMap.has(n)) {
            itemMap.set(n, {
            ...itemMap.get(n),
            multipleSources: true
            });
        } else {
            itemMap.set(n, {
            ...item,
            multipleSources: false
            });
        }
    });

    const items: Item[] = Array.from(itemMap.values())
    // console.log(items)

    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching ingredients' });
  }
};

export default handler;
