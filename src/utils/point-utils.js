import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { DateFormat, HOURS_IN_DAY, MINUTES_IN_HOUR, COUNT_ZERO } from '../const';

dayjs.extend(durationPlugin);

function humanizePointDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DateFormat.DATE_FORMAT).toUpperCase() : '';
}

function formatMachineDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DateFormat.MACHINE_DATE_FORMAT) : '';
}

function humanizePointTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(DateFormat.HUMAN_TIME_FORMAT) : '';
}

function formatMachineTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(DateFormat.MACHINE_TIME_FORMAT) : '';
}

function formatFormDateTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(DateFormat.FORM_DATE_TIME_FORMAT) : '';
}

function getEventDuration(dateFrom, dateTo) {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);

  const differenceInMinutes = end.diff(start, 'minute');

  if (differenceInMinutes <= 0) {
    return '00M';
  }

  const days = Math.floor(differenceInMinutes / (HOURS_IN_DAY * MINUTES_IN_HOUR));
  const hours = Math.floor((differenceInMinutes % (HOURS_IN_DAY * MINUTES_IN_HOUR)) / MINUTES_IN_HOUR);
  const minutes = differenceInMinutes % MINUTES_IN_HOUR;

  const formatNumber = (num) => String(num).padStart(COUNT_ZERO, '0');

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

function getCapitalizedType(type) {
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


export { humanizePointDueDate, formatMachineDate, formatMachineTime, formatFormDateTime, humanizePointTime, getEventDuration, getTypeOffers, getCapitalizedType, sortTime, sortPrice, sortDay };
