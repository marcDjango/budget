// File: components/BottomActionBar.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

export default function BottomActionBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-200 p-4 flex flex-wrap justify-around items-center gap-2">
      <Button variant="secondary" size="sm" className="flex items-center">
        <PlusIcon className="w-5 h-5 mr-2" />
        Action 1
      </Button>
      <Button variant="secondary" size="sm" className="flex items-center">
        <PlusIcon className="w-5 h-5 mr-2" />
        Action 2
      </Button>
      <Button variant="secondary" size="sm" className="flex items-center">
        <PlusIcon className="w-5 h-5 mr-2" />
        Action 3
      </Button>
    </div>
  );
}