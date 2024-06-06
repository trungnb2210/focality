import React, { useContext, useReducer, useState } from "react";
import IngredientsPage from "@/pages/ingredients";
import LocationPage from "@/pages/location";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="">
        <Link href={{
            pathname: "search",
            // query: {
            //     ingredient
            // }
        }}
        className="font-semibold p-3 rounded-xl bg-[#EEF5DB] text-[#3E3F3B] hover:bg-[#3E3F3B] 
        hover:text-[#EEF5DB] border-2 border-[#3E3F3B]">
            Select Ingredients
        </Link>
    </main>
  );
}
