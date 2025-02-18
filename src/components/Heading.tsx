import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

interface IHeading extends HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  children: React.ReactNode;
}
function Heading({ className, children, ...props }: IHeading) {
  return (
    <h1 className={cn("text-4xl sm:text-5xl text-pretty font-semibold tracking-tight text-zinc-800", className)} {...props}>
      {children}
    </h1>
  );
}

export default Heading;
