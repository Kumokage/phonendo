"use client";
import { Button, Label, TextInput } from "flowbite-react";
import { FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

export default function EditUser() {
  const { data: session, status: sessionStatus } = useSession();
  const setPhonendoId = api.post.setPhonendoId.useMutation();
  const router = useRouter();

  if (sessionStatus === "unauthenticated") {
    signIn();
  }

  if (setPhonendoId.isSuccess) {
    router.push(`/patient/${session?.user.id}`);
  }

  const onFormSubmite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phonendoId = formData.get("phonendoId");
    if (session?.user && phonendoId) {
      setPhonendoId.mutate({
        userId: session.user.id,
        phonendoId: phonendoId.toString(),
      });
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
            color={setPhonendoId.isError ? "failure" : "gray"}
            helperText={
              setPhonendoId.isError ? "Некорректный идентификатор" : ""
            }
            required
          />
        </div>
        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  );
}
