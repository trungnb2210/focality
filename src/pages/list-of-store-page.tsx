// // src/app/client/ingredient-list-page/page.tsx

// "use client";

// import React from 'react';
// import NavBar from '@/components/NavBar';

// const IngredientListPage: React.FC = () => {
//   const { ingredients } = useIngredientsContext();

//   return (
//     <div className="flex flex-col h-full">
//       <NavBar brandName="Ingredients List" />
//       <main className="flex-grow p-4">
//         <h1 className="text-2xl font-bold mb-4">Ingredients List</h1>
//         <div className="flex flex-col space-y-4 p-4">
//           {ingredients.map((ingredient, index) => (
//             <div
//               key={index}
//               className="flex justify-between items-center p-4 bg-[#4F6367] text-white rounded-full shadow-md"
//             >
//               <span>{ingredient}</span>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default IngredientListPage;
