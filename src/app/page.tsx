import React, { useContext, useReducer, useState } from "react";
import IngredientsPage from "@/pages/ingredients";
import LocationPage from "@/pages/location";

export default async function Home() {
  return (
    <main className="">
        {/* <LocationPage ingredientsList={["White Rice"]}></LocationPage> */}
        <IngredientsPage ingredients={[]}></IngredientsPage>
    </main>
  );
}
