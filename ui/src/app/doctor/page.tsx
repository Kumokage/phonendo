"use client";

import { skipToken } from "@tanstack/react-query";
import { Table, Spinner } from "flowbite-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { api } from "~/trpc/react";
import LinkButton from "../_components/LinkButton";

export default function DoctorPatients() {
  const session = useSession();
  if (session === null) {
    redirect("/api/auth/signin");
  }

  if (session.data && session.data.user.phonendo_id === null) {
    redirect("/auth/edit");
  }

  const patientsData = api.user.getDoctorPatientsData.useQuery(
    session.data?.user.phonendo_id
      ? {
          doctorId: session.data.user.phonendo_id,
        }
      : skipToken,
  );

  return (
    <div>
      {session && patientsData.data ? (
        <Table>
          <Table.Head>
            <Table.HeadCell>No</Table.HeadCell>
            <Table.HeadCell>ФИО</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Вероятность трамбоза</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">GoTo</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {patientsData.data.map((value, index) => {
              return (
                <Table.Row key={index}>
                  <Table.Cell>{index + 1}</Table.Cell>
                  <Table.Cell> {value.name}</Table.Cell>
                  <Table.Cell> {value.email}</Table.Cell>
                  <Table.Cell>
                    {value.patient_journal_records[0]?.ml_result ??
                      "Нет данных"}
                  </Table.Cell>
                  <Table.Cell>
                    <LinkButton href={`/patient/${value.id}`} />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      ) : (
        <Spinner />
      )}
    </div>
  );
}
