import ListPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoPresenter from './presenter/trip-info-presenter.js';
import BtnAddNewPointView from './view/add-point-btn-view.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FiltersModel from './model/filter-model.js';
import { render, } from './framework/render.js';
import PointsApiService from './points-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import OffersApiService from './offers-api-service.js';
import { AUTHORIZATION, END__POINT } from './const.js';

const header = document.querySelector('.page-header');
const tripInfoContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

const pointsModel = new PointsModel({ PointsTripServer: new PointsApiService(END__POINT, AUTHORIZATION) });
const offersModel = new OffersModel({ offersTripServer: new OffersApiService(END__POINT, AUTHORIZATION) });
const destinationsModel = new DestinationsModel({ destinationsTripServer: new DestinationsApiService(END__POINT, AUTHORIZATION) });
const filterModel = new FiltersModel();

const tripInfoPresenter = new TripInfoPresenter({
  tripInfoContainer,
  pointsModel,
  offersModel,
  destinationsModel
});

const btnAddNewPointComponent = new BtnAddNewPointView();

render(btnAddNewPointComponent, tripInfoContainer);

const listPresenter = new ListPresenter({
  container: tripEventsContainer,
  headerContainer: tripInfoContainer,
  btnAddNewPointComponent,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

tripInfoPresenter.init();
listPresenter.init();
filterPresenter.init();
