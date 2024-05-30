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
import IngredientsPage from "../pages/ingredient-list-page";
import React from "react";


export default async function Home() {
  // Fetch data from Prisma
//   const stores = await prisma.store.findMany();

  return (
    <main className="">
      <IngredientsPage ingredients={[]}></IngredientsPage>
    </main>
  );
}
