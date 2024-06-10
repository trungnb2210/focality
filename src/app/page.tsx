"use client"

import React, { useContext, useReducer, useState } from "react";
import IngredientsPage from "@/pages/ingredients";
import LocationPage from "@/pages/location";
import Link from "next/link";
import RecipeList from "@/pages/recipe";

export default async function Home() {
  return (
    <main className="">
        {/* <RecipeList userName={"Kevin Nguyen"}></RecipeList> */}
        <Link href={{
            pathname: "recipe",
            query: {
                username: "Kevin Nguyen" as string,
            }
        }}
        className="font-semibold p-3 rounded-xl bg-[#EEF5DB] text-[#3E3F3B] hover:bg-[#3E3F3B] 
        hover:text-[#EEF5DB] border-2 border-[#3E3F3B]">
            I am a user
        </Link>
        <Link href={{
            pathname: "storeside",
            // query: {
            //     ingredient
            // }
        }}
        className="font-semibold p-3 rounded-xl bg-[#EEF5DB] text-[#3E3F3B] hover:bg-[#3E3F3B] 
        hover:text-[#EEF5DB] border-2 border-[#3E3F3B]">
            I am a store owner
        </Link>
    </main>
  );
}
