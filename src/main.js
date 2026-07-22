import ListPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoView from './view/trip-info-view.js';
import BtnAddNewPointView from './view/add-point-btn-view.js';
import PointsModel from './model/points-model.js';
import OffersModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FiltersModel from './model/filter-model.js';
import { render, RenderPosition } from './framework/render.js';
import PointsApiService from './points-api-service.js';
import DestinationsApiService from './destinations-api-service.js';
import OffersApiService from './offers-api-service.js';

const AUTORIZATION = 'Basic Hew76qE2hdfW23sD';
const END__POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const header = document.querySelector('.page-header');
const tripInfoContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

const pointsModel = new PointsModel({ PointsTripServer: new PointsApiService(END__POINT, AUTORIZATION) });
const offersModel = new OffersModel({ offersTripServer: new OffersApiService(END__POINT, AUTORIZATION) });
const destinationsModel = new DestinationsModel({ destinationsTripServer: new DestinationsApiService(END__POINT, AUTORIZATION) });
const filterModel = new FiltersModel();

const tripInfoComponent = new TripInfoView();
const btnAddNewPointComponent = new BtnAddNewPointView();

render(btnAddNewPointComponent, tripInfoContainer);
render(tripInfoComponent, tripInfoContainer, RenderPosition.AFTERBEGIN);

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

listPresenter.init();
filterPresenter.init();
// pointsModel.init();
// destinationsModel.init();
// offersModel.init();
