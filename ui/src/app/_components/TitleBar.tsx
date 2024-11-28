import Image from "next/image";
import { auth } from "~/server/auth";

export default async function TitleBar() {
  const session = await auth();
  const imageSize = 70;
  return (
    <div className="flex flex-row items-center justify-between border-b px-3 py-1.5">
      <Image
        className="rounded-full"
        src="/placeholder.jpg"
        alt="Platform logo"
        width={imageSize}
        height={imageSize}
      />
      <h1 className="text-3xl">Phonendo UI</h1>
      <Image
        className="rounded-full"
        src={session?.user.image ?? "/placeholder.jpg"}
        width={imageSize}
        height={imageSize}
        alt="User image"
      />
    </div>
  );
}
