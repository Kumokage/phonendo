import Image from "next/image";
import JournalTimeline from "~/app/_components/JournalTimeline";
import UserCondition from "~/app/_components/UserCondition";
import { auth } from "~/server/auth";
import { Spinner } from "flowbite-react";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import { Role } from "@prisma/client";

export default async function PatientJournal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await auth();
  const slug = (await params).slug;
  if (session === null) {
    redirect("/api/auth/signin");
  }

  if (session.user.phonendo_id === null) {
    redirect("/auth/edit");
  }
  const userId = session.user.role === Role.DOCTOR ? slug : session.user.id;
  const userData = await api.user.getPatientData({ userId: userId });

  return (
    <>
      {session !== null && userData ? (
        <div className="flex flex-row gap-8">
          <div className="flex basis-1/2 flex-col items-start gap-8 px-10 py-1.5">
            <div className="flex flex-row items-center justify-evenly gap-32">
              <Image
                className="rounded-full"
                src={userData.image ?? "/placeholder.jpg"}
                alt="User image"
                width={100}
                height={100}
              />
              <div className="flex flex-col justify-between gap-1 text-xl font-normal">
                <p className="rounded-md border border-gray-400 px-4 py-1.5">
                  {userData.name}
                </p>
                <p className="rounded-md border border-gray-400 px-4 py-1.5">
                  {userData.email}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border-2 border-gray-400 px-14 py-4">
              <UserCondition
                diseaseRisk={userData.patient_journal_records[0]?.ml_result}
              />
            </div>
          </div>
          <div className="basis-1/2 py-5 ps-14">
            <JournalTimeline
              journalRecords={userData?.patient_journal_records}
            />
          </div>
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}
