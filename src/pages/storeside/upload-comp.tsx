import React, { ChangeEvent, useState, useEffect } from 'react';
import ExcelJS from 'exceljs';
import { Item2 } from '@/pages/storeside/storeside';

interface UploadComponentProps {
  storeId: string;
}

const UploadComponent: React.FC<UploadComponentProps> = ({ storeId }) => {
  const [sid, setsid] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {setsid(storeId);}, [storeId]);
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const items: Item2[] = [];
          const workbook = new ExcelJS.Workbook();
          await workbook.xlsx.load(reader.result as ArrayBuffer);
          const worksheet = workbook.getWorksheet(1);
          worksheet?.eachRow((row, rowNumber) => {
            if (rowNumber === 1) {
              // Skip header row
              return;
            }
            const rowValues = row.values;
            let slicedValues: ExcelJS.CellValue[] = [];
            if (Array.isArray(row.values)) {
                slicedValues = row.values.slice(1);
              } else {
                // Handle the case where rowValues is not an array
                console.error("rowValues is not an array:", rowValues);
              }
              
            const [name, nativeName, price, imageUrl, description] = (slicedValues) as string[];

            if (name && sid) {
              console.log(sid);
              items.push({
                name: name || '',
                nativeName: nativeName || '',
                price: parseFloat(price) || 0,
                imageUrl: typeof imageUrl === 'string' ? imageUrl : '',
                description: typeof description === 'string' ? description : '',
                storeId: sid,
              });
            }
          });

          const response = await fetch('../api/excel-upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(items),
          });

          const result = await response.json();
          if (response.ok) {
            setSuccess('File uploaded successfully');
          } else {
            setError(`Error: ${result.error}`);
          }
        } catch (error: any) {
          setError(`Error: ${error.message}`);
        }
      };

      reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      <input
        type="file"
        id="itemsCsv"
        accept=".xlsx"
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        onChange={handleFileChange}
        required
      />
      <p>Upload</p>
      {error && <p>Error: {error}</p>}
      {success && <p>{success}</p>}
    </div>
  );
};

export default UploadComponent;
