"use client"
import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const searchParams = useSearchParams();
  const intent = searchParams.get("intent");
  return (
    <div
      className="relative w-full flex flex-1 flex-col items-center justify-center
    "
    >
      <SignIn
        forceRedirectUrl={intent ? `/dashboard?intent=${intent}` : "/dashboard"}
      />
    </div>
  );
}

export default Page;
