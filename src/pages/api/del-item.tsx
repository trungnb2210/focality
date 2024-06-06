import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { iid } = req.query;

    try {
        if (!iid) {
            throw new Error('Item ID is missing');
          }
    
          const itemId = iid.toString(); 
          // Delete the item from the database based on the provided ID
          await prisma.item.delete({
            where: {
              iid: itemId,
            },
          });

      // Send a success response
      res.status(200).json({ message: 'Item deleted successfully' });
    } catch (error) {
      // If an error occurs, send an error response
      console.error('Error deleting item:', error);
      res.status(500).json({ error: 'Failed to delete item' });
    }
  } else {
    // If the HTTP method is not DELETE, send a method not allowed response
    res.setHeader('Allow', ['DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
