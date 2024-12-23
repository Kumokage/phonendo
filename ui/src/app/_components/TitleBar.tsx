"use client";
import { Button } from "flowbite-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TitleBar() {
  const [isShow, setIsShow] = useState(false);
  const session = useSession();
  const router = useRouter();
  const imageSize = 70;

  return (
    <div className="flex flex-row items-center justify-between border-b px-3 py-1.5">
      <Image
        className="rounded-full"
        src="/stethoscope.jpg"
        alt="Platform logo"
        width={imageSize}
        height={imageSize}
      />
      <h1 className="text-3xl">Phonendo UI</h1>
      <div className="relative">
        <div
          onClick={() => {
            setIsShow(true);
          }}
        >
          <Image
            className="rounded-full"
            src={session.data?.user.image ?? "/placeholder.jpg"}
            width={imageSize}
            height={imageSize}
            alt="User image"
          />
        </div>
        {isShow && (
          <Button
            onClick={() => {
              router.push("/api/auth/signout");
            }}
            color={"red"}
            size="sm"
            className="absolute -bottom-9 z-50"
          >
            Выйти
          </Button>
        )}
      </div>
    </div>
  );
}
