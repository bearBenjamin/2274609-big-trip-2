const POINT__TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

const EMPTY__POINT = {
  type: 'flight',
  destination: {},
  dateFrom: null,
  dateTo: null,
  price: 0,
  offers: [],
  isFavorite: false,
};

const TIME__LIMIT = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1050,
};

const AUTORIZATION = 'Basic Hew76qE2hdfW23sD';
const END__POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const CITY__COUNT = 3;

const METHOD = {
  GET: 'GET',
  PUT: 'PUT',
  'POST': 'POST',
  'DELETE': 'DELETE'
};

const FilterType = {
  EVERYTHING: 'EVERYTHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST',
};

const MessageNoEvent = {
  EVERYTHING: 'Click New Event to create your first point',
  PAST: 'There are no past events now',
  PRESENT: 'There are no present events now',
  FUTURE: 'There are no future events now',
};

const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price'
};

const UserAction = {
  UPDATE__POINT: 'UPDATE__POINT',
  ADD__POINT: 'ADD__POINT',
  DELETE__POINT: 'DELETE__POINT',
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export {
  POINT__TYPES as POINT__TYPE,
  FilterType,
  MessageNoEvent,
  SortType,
  UserAction,
  UpdateType,
  EMPTY__POINT,
  TIME__LIMIT as TimeLimit,
  AUTORIZATION, END__POINT,
  CITY__COUNT,
  METHOD
};
