import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  rounded?: "sm" | "md" | "lg" | "xl" | "full";
}

const roundedStyles: Record<NonNullable<SkeletonProps["rounded"]>, string> = {
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
};

export const Skeleton: React.FC<SkeletonProps> = ({
  rounded = "sm",
  className = "",
  style,
  ...props
}) => {
  return (
    <div
      className={`skeleton-shimmer animate-skeleton ${roundedStyles[rounded]} ${className}`}
      style={style}
      aria-hidden="true"
      {...props}
    />
  );
};
