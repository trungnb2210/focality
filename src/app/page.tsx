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
import Link from "next/link"
import IngredientsPage from "../pages/client/ingredient-list-page";
import SearchIngredientPage from "@/pages/client/search-ingredient-page";

export default async function Home() {
  // Fetch data from Prisma
  const stores = await prisma.store.findMany();

  return (
    <main className="">
      <SearchIngredientPage></SearchIngredientPage>
    </main>
  );
}
