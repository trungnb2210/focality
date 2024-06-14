import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createOrUpdateItem(
  name: string,
  nativeName: string | undefined,
  price: number,
  imageUrl: string | undefined,
  description: string | undefined,
  storeId: string
) {
    try {
      if (imageUrl === "" || imageUrl === undefined) {
        imageUrl = "https://gedhuiyjqbzrvz6n.public.blob.vercel-storage.com/ingredients/item_default-ZTc4HHFitsmUuquJz898puf6XoHrTh.jpg";
      }
      const store = await prisma.store.findUnique({
        where: { sid: storeId }
      });
    
      if (!store) {
        throw new Error(`Store with id ${storeId} does not exist.`);
      }

      let existingItem = await prisma.item.findFirst({
        where: {
          AND: [
            { name: name },
            { nativeName: nativeName }
          ]
        }
      });
  
      if (existingItem) {
        // Update existing item
        await prisma.item.update({
          where: { iid: existingItem.iid },
          data: {
            price: price,
            imageUrl: imageUrl,
            description: description,
            storeId: storeId
          }
        });
        return "Item updated successfully";
      } else {
        // Create new item
        await prisma.item.create({
          data: {
            name: name,
            nativeName: nativeName,
            price: price,
            imageUrl: imageUrl,
            description: description,
            storeId: storeId
          }
        });
        return "Item created successfully";
      }
    } catch (error) {
      console.error("Error:", error);
      return "Error occurred";
    }
  }

export default prisma;