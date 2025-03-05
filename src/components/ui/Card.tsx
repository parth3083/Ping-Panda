import { cn } from "@/lib/utils";
import React, { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
}

function Card({ contentClassName, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-lg bg-gray50 text-card-foreground",
        className
      )}
      {...props}
    >
      <div className={cn("relative z-10 p-6 ", contentClassName)}>
        {children}
          </div>
          <div className="absolute inset-px z-0 rounded-lg bg-white"/>
          <div className="absolute inset-px z-0 pointer-events-none rounded-lg shadow-sm ring-1 ring-black/5"/>
    </div>
  );
}

export default Card;
