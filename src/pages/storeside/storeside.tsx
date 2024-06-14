'use client'
import { useState, useEffect} from 'react';
import { useRouter } from 'next/navigation';
import { parse } from 'papaparse';
import ExcelJS from 'exceljs';
import "@/app/globals.css"

export interface Item2 {
  name: string;
  nativeName?: string;
  price: number;
  imageUrl?: string;
  description?: string;
  storeId: string;
};

export interface Item {
  iid: string;
  name: string;
  nativeName: string;
  price: number;
  imageUrl: string;
  description: string;
  storeId: string;
}

export interface Store {
  sid: string;
  name: string | null;
  sortcode: string;
  imageUrl: string;
  email: string;
  phoneNo: string;
  items: Item[];
}

export default function StoreSide() {
  const [name, setName] = useState('');
  const [nativeName, setNativeName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [storeId, setStoreId] = useState('');
  const [stores, setStores] = useState<Store[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState('');
  const [itemsCsv, setItemsCsv] = useState<File | null>(null);
  const [itemsExcel, setItemsExcel] = useState<File | null>(null);
  const [storeItems, setStoreItems] = useState<Item[]>([]);
  const [selectedFileType, setSelectedFileType] = useState('');
  const [selectedItemId, setSelectedItemId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch('../api/fetch-stores');
        const data = await response.json();
        setStores(data);
      } catch (error) {
        console.error('Failed to fetch stores:', error);
      }
    };

    fetchStores();
  }, []);

  const fetchStoreItems = async (storeId: string) => {
    try {
      const response = await fetch(`../api/fetch-items?storeId=${storeId}`);
      const data = await response.json();
      setStoreItems(data);
    } catch (error) {
      console.error('Failed to fetch store items:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let imageUrl = '';
    if (image) {
      const formData = new FormData();
      formData.append('file', image);

      const uploadResponse = await fetch('../api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.url; 
      } else {
        const uploadErrorData = await uploadResponse.json();
        setError(uploadErrorData.error);
        return;
      }
    }

    const response = await fetch('../api/add-item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        nativeName,
        price: parseFloat(price),
        imageUrl,
        description,
        storeId,
      }),
    });

    if (response.ok) {
      setSuccess('Item added successfully!');
      setError('');
      setName('');
      setNativeName('');
      setPrice('');
      setImage(null);
      setDescription('');
      setStoreId('');
      router.push('/');
    } else {
      const errorData = await response.json();
      setError(errorData.error);
      setSuccess('');
    }
  };

  const handleDownloadCsv = async () => {
    if (!storeId) {
      setError('Please select a store first.');
      return;
    }

    try {
      const response = await fetch(`/api/csv-download?storeId=${storeId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download CSV.');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'items.csv';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error: any) {
      setError(`Error: ${error.message}`);
    }
  };

  const handleUploadCsv = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (itemsCsv) {
      try {
        const fileReader = new FileReader();
  
        fileReader.onload = async (event) => {
          if (event.target) {
            const csvData = event.target.result as string;
            const parsedData = parse(csvData, { header: true });
            const items: Item2[] = [];
  
            parsedData.data.forEach((row: any) => {
              const { name, nativeName, price, imageUrl, description } = row;
  
              if (name && storeId) {
                items.push({
                  name: name || '',
                  nativeName: nativeName || '',
                  price: parseFloat(price) || 0,
                  imageUrl: typeof imageUrl === 'string' ? imageUrl : '',
                  description: typeof description === 'string' ? description : '',
                  storeId: storeId,
                });
              }
            });
  
            try {
              const response = await fetch('../api/upload-items', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(items),
              });
  
              if (response.ok) {
                setSuccess('Items added successfully!');
                setError('');
                setItemsCsv(null);
              } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to upload items.');
                setSuccess('');
              }
            } catch (error) {
              setError('Failed to upload items.');
              setSuccess('');
            }
          }
        };
  
        fileReader.readAsText(itemsCsv);
      } catch (error) {
        setError('Error reading file.');
      }
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`../api/del-item?iid=${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Item deleted successfully!');
        setError('');
        // Refetch the items after deletion
        fetchStoreItems(storeId);
      } else {
        const errorData = await response.json();
        setError(errorData.error);
        setSuccess('');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      setError('Failed to delete item');
      setSuccess('');
    }
  };

  const handleDownloadExcel = async () => {
    if (!storeId) {
      setError('Please select a store first.');
      return;
    }

    try {
      const response = await fetch(`../api/excel-download?storeId=${storeId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'items.xlsx';
        document.body.appendChild(a);
        a.click();
        a.remove();
      } else {
        const errorData = await response.json();
        setError(errorData.error);
      }
    } catch (error) {
      console.error('Failed to download items:', error);
      setError('Failed to download items.');
    }
  };

  const handleUploadExcel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (itemsExcel) {
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          try {
            const items: Item2[] = [];
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(reader.result as ArrayBuffer);
            const worksheet = workbook.getWorksheet(1);
            worksheet?.eachRow((row, rowNumber) => {
              if (rowNumber === 1) return; // Skip header row

              const rowValues = row.values;
              let slicedValues: ExcelJS.CellValue[] = [];
              if (Array.isArray(row.values)) {
                slicedValues = row.values.slice(1);
              } else {
                console.error("rowValues is not an array:", rowValues);
              }

              const [name, nativeName, price, imageUrl, description] = slicedValues as string[];

              if (name && storeId) {
                items.push({
                  name: name || '',
                  nativeName: nativeName || '',
                  price: parseFloat(price) || 0,
                  imageUrl: typeof imageUrl === 'string' ? imageUrl : '',
                  description: typeof description === 'string' ? description : '',
                  storeId: storeId,
                });
              }
            });

            const response = await fetch('../api/upload-items', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(items),
            });

            const result = await response.json();
            if (response.ok) {
              setSuccess('File uploaded successfully');
              setError('');
            } else {
              throw new Error(result.error);
            }
          } catch (error: any) {
            throw error;
          }
        };

        reader.readAsArrayBuffer(itemsExcel);
      } catch (error: any) {
        setError(`Error: ${error.message}`);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-md shadow-md">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}
      
      <div className="mb-4">
        <label htmlFor="storeId" className="block text-sm font-medium text-gray-700">Select Store:</label>
        <select
          id="storeId"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          value={storeId}
          onChange={(e) => {
            setStoreId(e.target.value);
            fetchStoreItems(e.target.value);
          }}
          required
        >
          <option value="" disabled>Select a store</option>
          {stores.map((store) => (
            <option key={store.sid} value={store.sid}>
              {store.name}
            </option>
          ))}
        </select>
      </div>
  
      {storeId && (
        <>
          <div className="mb-4">
            <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">Choose File Type:</label>
            <select
              id="fileType"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              value={selectedFileType}
              onChange={(e) => setSelectedFileType(e.target.value)}
            >
              <option value="" disabled>Select file type</option>
              <option value="xlsx">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>
  
          {selectedFileType === 'csv' && (
            <div>
              <form onSubmit={handleUploadCsv}>
                <div className="mb-4">
                  <label htmlFor="itemsCsv" className="block text-sm font-medium text-gray-700">Upload Items (.csv):</label>
                  <input
                    type="file"
                    id="itemsCsv"
                    accept=".csv"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={(e) => setItemsCsv(e.target.files?.[0] || null)}
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={handleDownloadCsv}
                  >
                    Download Items
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Upload Updated Items
                  </button>
                </div>
              </form>
            </div>
          )}
  
          {selectedFileType === 'xlsx' && (
            <div>
              <form onSubmit={handleUploadExcel}>
                <div className="mb-4">
                  <label htmlFor="itemsExcel" className="block text-sm font-medium text-gray-700">Upload Items (.xlsx):</label>
                  <input
                    type="file"
                    id="itemsExcel"
                    accept=".xlsx"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    onChange={(e) => setItemsExcel(e.target.files?.[0] || null)}
                    required
                  />
                </div>
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                    onClick={handleDownloadExcel}
                  >
                    Download Items
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
                  >
                    Upload Updated Items
                  </button>
                </div>
              </form>
            </div>
          )}
  
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Store Items</h2>
            {storeItems.length > 0 ? (
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2">Image</th>
                    <th className="py-2">Name</th>
                    <th className="py-2">Native Name</th>
                    <th className="py-2">Price</th>
                    <th className="py-2">Description</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {storeItems.map((item) => (
                    <tr key={item.iid}>
                      <td className="py-2">
                        <img src={item.imageUrl} alt={item.name} className="h-16 w-16 object-cover" />
                      </td>
                      <td className="py-2">{item.name}</td>
                      <td className="py-2">{item.nativeName}</td>
                      <td className="py-2">£{item.price}</td>
                      <td className="py-2">{item.description}</td>
                      <td className="py-2">
                        <button
                          className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600 transition duration-300"
                          onClick={() => handleDeleteItem(item.iid)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))} 
                </tbody>
              </table>
            ) : (
              <p>No items found for the selected store.</p>
            )}
          </div>
  
          <h1 className="text-2xl font-bold mb-6">Add New Item</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name:</label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="nativeName" className="block text-sm font-medium text-gray-700">Native Name:</label>
              <input
                type="text"
                id="nativeName"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={nativeName}
                onChange={(e) => setNativeName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price:</label>
              <input
                type="number"
                id="price"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image:</label>
              <input
                type="file"
                id="image"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description:</label>
              <textarea
                id="description"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Add Item
            </button>
          </form>
        </>
      )}
  
    </div>
  );
}