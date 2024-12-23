import { Role } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "~/server/auth";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    if (!session.user.phonendo_id) {
      redirect("/auth/edit");
    }

    switch (session.user.role) {
      case Role.DOCTOR:
        redirect("/doctor");
      default:
        redirect(`/patient/${session.user.id}`);
    }
  } else {
    redirect("/api/auth/signin");
  }
}
