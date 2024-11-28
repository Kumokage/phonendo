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
        <div className="flex flex-row">
          <div className="flex basis-1/2 flex-col">
            <div className="flex flex-row">
              <Image
                className="rounded-full"
                src={session.user.image ?? "/placeholder.jpg"}
                alt="User image"
                width={100}
                height={100}
              />
              <div className="flex flex-col">
                <span>{session.user.name}</span>
                <span>{session.user.email}</span>
              </div>
            </div>
            <UserCondition userId={session.user.id} />
            <UserPersonalInfo />
          </div>
          <div className="basis-1/2">
            <JournalTimeline />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
