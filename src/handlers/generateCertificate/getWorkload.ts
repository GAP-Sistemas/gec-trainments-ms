import { getConvertedTime } from "./index"

interface IScheduledDate {
  to: Date;
  from: Date;
}

export const getWorkload = (scheduledTime: IScheduledDate) => {
  let totalTime = 0;

  const to = new Date(scheduledTime.to);
  const from = new Date(scheduledTime.from);
  const intervalo = to.getTime() - from.getTime();
  totalTime += intervalo;

  return getConvertedTime(totalTime);
}
