import Link from "next/link";

// Link to the estimate page, styled by the caller
export default function EstimateButton({ className = "", children = "Get an estimate" }: { className?: string; children?: React.ReactNode }) {
  return (
    <Link href="/estimate" className={className}>
      {children}
    </Link>
  );
}
