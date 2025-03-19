"use client";
import { Button } from "@/components/ui/button";
import Card from "@/components/ui/Card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";

function AccountSettings({
  discordId: initialDiscordId,
}: {
  discordId: string;
}) {
  const [discordId, setDiscordId] = useState(initialDiscordId);
  
  // Fix: Update mutation to accept a parameter
  const { mutate, isPending } = useMutation({
    mutationFn: async (discordIdToSave: string) => {
      const response = await fetch("/api/set-discordId", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          discordId: discordIdToSave,
        }),
      });
      return await response.json();
    },
  });

  return (
    <Card className="max-w-xl w-full space-y-4">
      <div className="pt-2">
        <Label>Discord ID</Label>
        <Input
          className="mt-1"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder="Enter your Discord ID"
        />
      </div>

      <p className="mt-2 text-sm/6 text-gray-600">
        Don{"'"}t know how to find your Discord ID?{" "}
        <Link href="#" className="text-brand-600 hover:text-brand-500">
          Learn how to obtain it here
        </Link>
        .
      </p>

      <div className="pt-4">
        <Button onClick={() => mutate(discordId)} disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
}

export default AccountSettings;