import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import ExcelJS from 'exceljs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const storeId = req.query.storeId as string;
  try {
    const items = await prisma.item.findMany({
      where: {
        storeId: { contains: storeId, mode: "insensitive" }
      },
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Items');

    worksheet.columns = [
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Native Name', key: 'nativeName', width: 30 },
      { header: 'Price', key: 'price', width: 15 },
      { header: 'Image URL', key: 'imageUrl', width: 50 },
      { header: 'Description', key: 'description', width: 50 },
    ];

    items.forEach(item => {
      worksheet.addRow({
        name: item.name,
        nativeName: item.nativeName,
        price: item.price,
        imageUrl: item.imageUrl,
        description: item.description,
      });
    });

    // Write to a buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Send the buffer as a download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=items.xlsx');
    res.send(buffer);
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' });
  }
}
