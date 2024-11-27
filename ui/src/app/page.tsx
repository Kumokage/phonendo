import { redirect } from "next/navigation";
import { auth } from "~/server/auth";
import { UserRole } from "~/server/auth/config";

export default async function Home() {
  const session = await auth();

  if (session?.user) {
    if (!session.user.phonendo_id) {
      redirect("/auth/edit");
    }

    switch (session.user.role) {
      case UserRole.DOCTOR:
        redirect("/doctor");
      default:
        redirect(`/patient/${session.user.id}`);
    }
  }
}
