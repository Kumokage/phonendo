"use client";
import { Button, Label, TextInput, ToggleSwitch } from "flowbite-react";
import { type FormEvent, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { env } from "~/env";
import { Role } from "@prisma/client";

export default function EditUser() {
  const { data: session, status: sessionStatus } = useSession();
  const setPhonendoId = api.user.setPhonendoId.useMutation();
  const [isError, setIsError] = useState(false);
  const [isKeyError, setIsKeyError] = useState(false);
  const [isDoctor, setIsDoctor] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "unauthenticated") {
      router.push("/api/auth/signin");
    }
    if (session && session?.user.phonendo_id !== null) {
      switch (session.user.role) {
        case Role.DOCTOR:
          router.replace("/doctor");
          break;
        case Role.PATIENT:
          router.replace(`/patient/${session?.user.id}`);
          break;
      }
    }
  }, [sessionStatus, router, session]);

  useEffect(() => {
    if (setPhonendoId.isSuccess) {
      if (isDoctor) {
        router.replace(`/doctor`);
      } else {
        router.replace(`/patient/${session?.user.id}`);
      }
    }
  }, [router, session?.user.id, setPhonendoId.isSuccess, isDoctor]);

  const onFormSubmite = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const phonendoId = Number(formData.get("phonendoId"));

    if (isDoctor) {
      const doctorKey = formData.get("doctorKey")?.toString();
      if (doctorKey != env.NEXT_PUBLIC_DOCTOR_SECRET_KEY) {
        setIsKeyError(true);
        return;
      }
    }

    if (session?.user && !isNaN(phonendoId)) {
      await setPhonendoId.mutateAsync({
        userId: session.user.id,
        phonendoId: phonendoId,
        isDoctor: isDoctor,
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
        <ToggleSwitch
          label="Являетесь ли вы доктором?"
          checked={isDoctor}
          onChange={setIsDoctor}
        />
        {isDoctor && (
          <div>
            <div className="mb-2 block text-lg">
              <Label htmlFor="phonendoId" value="Код подтверждения" />
            </div>
            <TextInput
              id="doctorKey"
              name="doctorKey"
              placeholder="Код"
              color={isKeyError ? "failure" : "gray"}
              helperText={isKeyError ? "Некорректный код" : ""}
              required
            />
          </div>
        )}
        <Button type="submit">Сохранить</Button>
      </form>
    </div>
  );
}
