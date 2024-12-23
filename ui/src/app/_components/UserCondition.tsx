import { HiFire, HiHeart } from "react-icons/hi";

type UserConditionProps = {
  diseaseRisk?: number;
};

export default function UserCondition({ diseaseRisk }: UserConditionProps) {
  const THRESHOLD = 0.5;

  return (
    <div className="flex flex-row items-center">
      {diseaseRisk == undefined ? (
        <>
          <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-200">
            <HiHeart className="h-12 w-12" />
          </div>
          <div className="ml-3 text-xl font-medium">У вас пока нет данных</div>
        </>
      ) : (
        <>
          {diseaseRisk > THRESHOLD ? (
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
        </>
      )}
    </div>
  );
}
