import React, { useContext, useReducer, useState } from "react";
import IngredientsPage from "@/pages/ingredients";
import StoreSide from "@/pages/storeside";

export default async function Home() {
  return (
    <main className="">
      <StoreSide></StoreSide>
        {/* <IngredientsPage ingredients={[]}></IngredientsPage> */}
    </main>
  );
}
