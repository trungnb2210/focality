import React, { useContext, useReducer, useState } from "react";
import IngredientsPage from "@/pages/ingredients";

export default async function Home() {
  return (
    <main className="">
        <IngredientsPage ingredients={[]}></IngredientsPage>
    </main>
  );
}
