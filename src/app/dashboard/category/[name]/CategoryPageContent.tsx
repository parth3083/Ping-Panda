"use client"
import { EventCategory } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import EmptyCategoryPage from "./EmptyCategoryPage";

interface categoryPageContentProps {
  hasEvents: boolean;
  category: EventCategory;
}

function CategoryPageContent({
  hasEvents: initialHasEvents,
  category,
}: categoryPageContentProps) {
  const { data: pollingData } = useQuery({
    queryKey: ["category", category.name, "hasEvents"],
    initialData: { hasEvents: initialHasEvents },
  });

  if (!pollingData.hasEvents) {
    return <EmptyCategoryPage categoryName={category.name}></EmptyCategoryPage>;
  }
  return <div>CategoryPageContent</div>;
}

export default CategoryPageContent;
