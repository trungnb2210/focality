import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createOrUpdateItem(name: string, nativeName:string|undefined, price:number, imageUrl:string|undefined, description:string|undefined, storeId:string) {
    try {
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
  
  // Usage example
  createOrUpdateItem("Item Name", "Native Name", 10.99, "image.jpg", "Description", "store123")
    .then(result => console.log(result));

export default prisma;