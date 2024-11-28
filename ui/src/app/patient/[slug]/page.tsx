import Image from "next/image";
import JournalTimeline from "~/app/_components/JournalTimeline";
import UserCondition from "~/app/_components/UserCondition";
import UserPersonalInfo from "~/app/_components/UserPersonalInfo";
import { auth } from "~/server/auth";
import { Spinner } from "flowbite-react";

export default async function PatientJournal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const userId = (await params).slug;
  return (
    <>
      {session !== null ? (
        <div className="flex flex-row gap-8">
          <div className="flex basis-1/2 flex-col items-start gap-8 px-10 py-1.5">
            <div className="flex flex-row items-center justify-evenly gap-32">
              <Image
                className="rounded-full"
                src={session.user.image ?? "/placeholder.jpg"}
                alt="User image"
                width={100}
                height={100}
              />
              <div className="flex flex-col justify-between gap-1 text-xl font-normal">
                <span className="rounded-md border border-gray-400 px-2 py-1">
                  {session.user.name}
                </span>
                <span className="rounded-md border border-gray-400 px-2 py-1">
                  {session.user.email}
                </span>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-gray-400 px-14 py-4">
              <UserCondition userId={session.user.id} />
            </div>
            <UserPersonalInfo />
          </div>
          <div className="basis-1/2 py-5 ps-14">
            <JournalTimeline />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
