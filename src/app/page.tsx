import prisma from "../../lib/primsa";

export default async function Home() {
  const itemName = "Fish Sauce";
  const stores = await prisma.store.findMany({
    where: {
      items: {
        some: {
          name: itemName,
        },
      },
    },
    include: {
      items: true, // Include items to see which items each store has
    },
  });
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>Focality</h1>
      {/* <pre>{JSON.stringify(stores, null, 2)}</pre> */}
      <div>
        {stores.map((store, index) => (
          <div key={index} className="store">
            <p>{store.name} : {store.sortcode}</p>
            {store.imageUrl && (
              <img
                src={store.imageUrl}
                alt={`${store.name} image`}
                width="300"
                height="200"
              />
            )}
            <div>
              <h2>Items:</h2>
              <ul>
                {store.items.map((item) => (
                  <li key={item.iid}>
                    <p>{item.name} - {item.nativeName}</p>
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={`${item.name} image`}
                        width="150"
                        height="100"
                      />
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </main> 
  );
}
