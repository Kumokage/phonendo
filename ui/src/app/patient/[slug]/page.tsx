export default async function PatientJournal({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const userId = (await params).slug;
  return <div>Patient {userId}</div>;
}
