import { Button } from "flowbite-react";
import Link from "next/link";
import { HiExternalLink } from "react-icons/hi";

type LinkButtonProps = {
  href: string;
};

export default function LinkButton({ href }: LinkButtonProps) {
  return (
    <div className="flex w-full flex-row justify-between gap-2">
      <Link href={href}>
        <Button color="gray" size={"xs"}>
          <HiExternalLink className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  );
}
