"use client";
import { Timeline } from "flowbite-react";

export default function JournalTimeline() {
  const journalRecords = [
    {
      time: "12:55:31",
      date: "2024-09-03",
      diseaseRisk: 0.54,
      conclusion: "Some doctor conclusion",
    },
  ];
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
                Вероятность трамбоза {record.diseaseRisk}
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
