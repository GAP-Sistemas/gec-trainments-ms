import { getConvertedTime } from './getConvertedTime';

interface IScheduledDate {
  to: Date;
  from: Date;
}

export const getWorkload = (scheduledTime: IScheduledDate) => {
  const to = new Date(scheduledTime.to);
  const from = new Date(scheduledTime.from);
  const intervalo = to.getTime() - from.getTime();
  return getConvertedTime(intervalo);
}
