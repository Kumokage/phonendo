"use client";
import { type JournalRecord } from "@prisma/client";
import { Timeline } from "flowbite-react";

type JournalTimelineParams = {
  journalRecords: Array<JournalRecord>;
};
export default function JournalTimeline({
  journalRecords,
}: JournalTimelineParams) {
  return (
    <Timeline>
      {journalRecords.map((record, key) => {
        return (
          <Timeline.Item key={key}>
            <Timeline.Point />
            <Timeline.Content>
              <Timeline.Time>
                {record.date} {record.time}
              </Timeline.Time>
              <Timeline.Title>
                Вероятность трамбоза {record.ml_result}
              </Timeline.Title>
              {record.conclusion && record.conclusion.length !== 0 && (
                <Timeline.Content>{record.conclusion}</Timeline.Content>
              )}
            </Timeline.Content>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
}
