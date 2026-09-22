export type FixedPackageSchedule = {
  date: string;
  time: string;
  dateTime: string;
};

export function getFixedPackageSchedule(
  dateValue: string | null | undefined,
  timeValue: string | null | undefined,
): FixedPackageSchedule | null {
  if (!dateValue || !timeValue) return null;

  const date = dateValue.substring(0, 10);
  const time = timeValue.slice(0, 5);
  if (!date || !time) return null;

  return {
    date,
    time,
    dateTime: `${date}T${time}:00`,
  };
}
