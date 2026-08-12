import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';

dayjs.extend(durationPlugin);

const DATE__FORMAT = 'MMM D';
const MACHINE_DATE_FORMAT = 'YYYY-MM-DD';

const HUMAN_TIME_FORMAT = 'HH:mm';
const MACHINE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm';

const FORM__DATE__TIME__FORMAT = 'DD/MM/YY HH:mm';

function humanazePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE__FORMAT).toUpperCase() : '';
}

function formatMachineDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(MACHINE_DATE_FORMAT) : '';
}

function humanizePointTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(HUMAN_TIME_FORMAT) : '';
}

function formatMachineTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(MACHINE_TIME_FORMAT) : '';
}

function formatFormDateTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(FORM__DATE__TIME__FORMAT) : '';
}

function getEventDuration(dateFrom, dateTo) {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);

  const differenceInMinutes = end.diff(start, 'minute');

  if (differenceInMinutes <= 0) {
    return '00M';
  }

  const days = Math.floor(differenceInMinutes / (24 * 60));
  const hours = Math.floor((differenceInMinutes % (24 * 60)) / 60);
  const minutes = differenceInMinutes % 60;

  const formatNumber = (num) => String(num).padStart(2, '0');

  if (days > 0) {
    return `${formatNumber(days)}D ${formatNumber(hours)}H ${formatNumber(minutes)}M`;
  }

  if (hours > 0) {
    return `${formatNumber(hours)}H ${formatNumber(minutes)}M`;
  }

  return `${formatNumber(minutes)}M`;
}

function getTypeOffers(offers, type) {
  return offers.find((offer) => offer.type === type);
}

function getCapitalaizedType(type) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

function sortTime(pointA, pointB) {
  const durationA = dayjs(pointA.dateTo).diff(dayjs(pointA.dateFrom));
  const durationB = dayjs(pointB.dateTo).diff(dayjs(pointB.dateFrom));
  return durationB - durationA;
}

function sortPrice(pointA, pointB) {
  return pointB.price - pointA.price;
}

function sortDay(pointA, pointB) {
  return dayjs(pointA.dateFrom).diff(dayjs(pointB.dateFrom));
}


export { humanazePointDueDate, formatMachineDate, formatMachineTime, formatFormDateTime, humanizePointTime, getEventDuration, getTypeOffers, getCapitalaizedType, sortTime, sortPrice, sortDay };
