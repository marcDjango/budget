"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { PlusIcon } from "@radix-ui/react-icons";

interface NewButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const NewButton = ({
  children,
  mode = "redirect",
  asChild,
}: NewButtonProps) => {
  const router = useRouter();
  const onClick = () => {
    router.push("/client/dashbord/add");
  };

  if (mode === "modal") {
    return <span>TODO : implement modal</span>;
  }

  return (
    <span onClick={onClick} className="cursor-pointer">
      <Button variant="default" size="lg">
        <PlusIcon className="w-5 h-5 mr-2" />
        {children}
      </Button>
    </span>
  );
};
