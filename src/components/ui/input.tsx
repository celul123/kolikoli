import * as React from "react";

import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ring = true,
  ...props
}: React.ComponentProps<"input"> & { ring?: boolean }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-separator placeholder:font-medium border-input flex min-w-0 rounded-md border bg-[#DAE0D4] px-3 shadow-sm transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        {
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]":
            ring,
        },
        className
      )}
      {...props}
    />
  );
}

export { Input };
