import ListPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoView from './view/trip-info-view.js';
// import FilterView from './view/filter-view.js';
import PointsModel from './model/points-model.js';
import OffesModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FiltersModel from './model/filter-model.js';
// import { generateFilter } from './mock/filter.js';
import { render, RenderPosition } from './framework/render.js';
import { offersData, destinationsData } from './mock/point.js';

const header = document.querySelector('.page-header');
const tripInfoContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

const tripInfoComponent = new TripInfoView();

const pointsModel = new PointsModel(offersData, destinationsData);
const offersModel = new OffesModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FiltersModel();

// const points = pointsModel.points;
// const filtersData = generateFilter(points);

// const filterComponent = new FilterView(filtersData);

render(tripInfoComponent, tripInfoContainer, RenderPosition.AFTERBEGIN);
// render(filterComponent, filterContainer);

const ListComponent = new ListPresenter({
  container: tripEventsContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

ListComponent.init();
filterPresenter.init();
