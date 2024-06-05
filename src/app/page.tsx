import React, { useContext, useReducer, useState } from "react";
import IngredientsPage from "@/pages/ingredients";
import LocationPage from "@/pages/location";

export default async function Home() {
  return (
    <main className="">
        <IngredientsPage ingredients={[]}></IngredientsPage>
    </main>
  );
}
