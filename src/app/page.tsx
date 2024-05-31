import React, { useContext, useReducer, useState } from "react";
import IngredientsPage from "@/pages/ingredients";

export default async function Home() {
  return (
    <main className="bg-white">
        <IngredientsPage ingredients={[]}></IngredientsPage>
    </main>
  );
}
