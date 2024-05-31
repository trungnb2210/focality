// import prisma from "../../lib/primsa";

// export default async function Home() {
//   // Fetch data from Prisma
//   const data = await prisma.store.findMany();
//   return (
//     <main className="flex min-h-screen flex-col items-center justify-center p-24">
//       <h1>Hello, World to me!</h1>
//       <pre>{JSON.stringify(data, null, 2)}</pre>
//     </main>
//   );
// }
import React, { useContext, useReducer, useState } from "react";
import IngredientsPage from "@/pages/ingredients";

export default async function Home() {
  // Fetch data from Prisma
//   const stores = await prisma.store.findMany();
//   let i = [
//     "Pork Belly",
//     "Pork Shoulder",
//     "Rico Coconut Soda",
//     "Fish sauce - Nước Mắm (Vietnam)",
//     "Salt",
//     "Caramel Color (nuoc mau)",
//     "Eggs",
//     "Yellow Onion"
//   ];

  return (
    <main className="bg-white">
        <IngredientsPage ingredients={[]}></IngredientsPage>
    </main>
  );
}
