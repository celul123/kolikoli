import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit" | "reset";
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: (...args: any[]) => unknown;
}

const Button = ({
  children,
  className,
  type = "button",
  onClick,
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={`${className} bg-koli-red border-2 border-koli-red-dark px-6 py-1.5 rounded-md text-background text-md font-medium hover:opacity-60 cursor-pointer`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
