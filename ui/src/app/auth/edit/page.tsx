"use client";
import { Button, Label, TextInput } from "flowbite-react";
import { type FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { UserRole } from "~/server/auth/definitions";

export default function EditUser() {
  const { data: session, status: sessionStatus } = useSession();
  const setPhonendoId = api.post.setPhonendoId.useMutation();
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/api/auth/signin");
    }
    if (session && session?.user.phonendo_id !== null) {
      switch (UserRole[session.user.role] as any) {
        case UserRole.DOCTOR:
          router.replace("/doctor");
          break;
        case UserRole.PATIENT:
          router.replace(`/patient/${session?.user.id}`);
          break;
      }
    }
  }, [sessionStatus, router, session]);

  useEffect(() => {
    if (setPhonendoId.isSuccess) {
      router.replace(`/patient/${session?.user.id}`);
    }
  }, [router, session?.user.id, setPhonendoId.isSuccess]);

  const onFormSubmite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phonendoId = Number(formData.get("phonendoId"));
    if (session?.user && !isNaN(phonendoId)) {
      await setPhonendoId.mutateAsync({
        userId: session.user.id,
        phonendoId: phonendoId,
      });
    } else {
      setIsError(true);
    }
  };

  return (
    <div className="flex h-full items-center justify-center">
      <form className="flex max-w-md flex-col gap-4" onSubmit={onFormSubmite}>
        <h2 className="text-2xl font-medium"> Заполните форму </h2>
        <div>
          <div className="mb-2 block text-lg">
            <Label htmlFor="phonendoId" value="Ваш идентификатор в системе" />
          </div>
          <TextInput
            id="phonendoId"
            name="phonendoId"
            placeholder="Идентификатор"
            color={setPhonendoId.isError || isError ? "failure" : "gray"}
            helperText={
              setPhonendoId.isError || isError
                ? "Некорректный идентификатор"
                : ""
            }
            required
          />
        </div>
        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  );
}
