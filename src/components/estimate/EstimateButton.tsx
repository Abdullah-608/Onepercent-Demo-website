"use client";
import { useEstimate } from "@/components/estimate/EstimateProvider";

// Opens the estimate drawer; usable from server components
export default function EstimateButton({ className = "", children = "Get an estimate" }: { className?: string; children?: React.ReactNode }) {
  const { open } = useEstimate();
  return (
    <button type="button" onClick={open} className={className}>
      {children}
    </button>
  );
}
