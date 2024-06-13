"use client"

import React from "react";
import Link from "next/link";

export default async function Home() {
  return (
    <main className="">
        <Link href={{
            pathname: "userside/recipe",
            query: {
                username: "Kevin Nguyen" as string,
            }
        }}
        className="font-semibold p-3 rounded-xl bg-[#EEF5DB] text-[#3E3F3B] hover:bg-[#3E3F3B] 
        hover:text-[#EEF5DB] border-2 border-[#3E3F3B]">
            I am a user
        </Link>
        <Link href={{
            pathname: "storeside/storeside",
        }}
        className="font-semibold p-3 rounded-xl bg-[#EEF5DB] text-[#3E3F3B] hover:bg-[#3E3F3B] 
        hover:text-[#EEF5DB] border-2 border-[#3E3F3B]">
            I am a store owner
        </Link>
    </main>
  );
}
