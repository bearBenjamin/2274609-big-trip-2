const POINT__TYPE = [
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

const FilterType = {
  EVERITHING: 'EVERITHING',
  FUTURE: 'FUTURE',
  PRESENT: 'PRESENT',
  PAST: 'PAST',
};


const MessageNoEvent = {
  EVERITHING: 'Click New Event to create your first point',
  PAST: 'There are no past events',
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

const EMPTY__POINT = {
  type: 'flight',
  destination: {},
  dateFrom: null,
  dateTo: null,
  price: 0,
  offers: [],
  isFavorite: false,
};


export { POINT__TYPE, FilterType, MessageNoEvent, SortType, UserAction, UpdateType, EMPTY__POINT };
