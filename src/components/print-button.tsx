"use client";

import { Printer } from "lucide-react";
import { Button } from "./ui/button";

export function PrintButton() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handlePrint}
      className="no-print h-7 px-2.5 text-xs inline-flex items-center gap-1.5"
    >
      <Printer className="h-3.5 w-3.5" aria-hidden />
      <span>Rapport afdrukken</span>
    </Button>
  );
}
