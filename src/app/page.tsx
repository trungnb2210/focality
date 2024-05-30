import prisma from "../../lib/primsa";

export default async function Home() {
  // Fetch data from Prisma
  const stores = await prisma.store.findMany();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>Focality</h1>
      <pre>{JSON.stringify(stores, null, 2)}</pre>
      <div>
        {stores.map((store, index) => (
          <p key={index}>{store.name} : {store.sortcode}</p>
        ))}
      </div>
    </main>
  );
}
