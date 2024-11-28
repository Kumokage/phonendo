import { HiFire, HiHeart } from "react-icons/hi";

type UserConditionProps = {
  userId: string;
};

const THRESHOLD = 0.5;

export default function UserCondition({ userId }: UserConditionProps) {
  const diseaseRisk = Number(userId) % 2 == 0 ? 0.94 : 0.23;

  return (
    <div className="flex flex-row items-center">
      {diseaseRisk < THRESHOLD ? (
        <>
          <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200">
            <HiFire className="h-12 w-12" />
          </div>
          <div className="ml-3 text-xl font-medium">
            Подозрение на дисфункцию фистулы
          </div>
        </>
      ) : (
        <>
          <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
            <HiHeart className="h-12 w-12" />
          </div>
          <div className="ml-3 text-xl font-medium">
            Дисфункции фистулы не обнаружено
          </div>
        </>
      )}
    </div>
  );
}
