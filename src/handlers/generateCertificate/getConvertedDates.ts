import moment from 'moment';

const formatarData = (data: Date) => {
  return moment(data).locale('pt-br').format('DD/MMM/YYYY');
};

export const getConvertedDates = (scheduledTime: { from: Date; to: Date }[]) => {
  const fromDates = scheduledTime.map((item) => moment(item.from).set({ hour: 12, minute: 0, second: 0 }));
  const toDates = scheduledTime.map((item) => moment(item.to).set({ hour: 12, minute: 0, second: 0 }));

  const minFromDate = moment.min(fromDates);
  const maxToDate = moment.max(toDates);

  if (minFromDate.isSame(maxToDate, 'day')) {
    return formatarData(minFromDate.toDate());
  }

  return formatarData(minFromDate.toDate()) + ' até ' + formatarData(maxToDate.toDate());
};