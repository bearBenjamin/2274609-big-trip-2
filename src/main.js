import ListPresenter from './presenter/list-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import TripInfoView from './view/trip-info-view.js';
import BtnAddNewPointView from './view/add-point-btn-view.js';
import PointsModel from './model/points-model.js';
import OffesModel from './model/offers-model.js';
import DestinationsModel from './model/destinations-model.js';
import FiltersModel from './model/filter-model.js';
import { render, RenderPosition } from './framework/render.js';
// import { offersData, destinationsData } from './mock/point.js';
import PointsApiService from './points-api-service.js';

const AUTORIZATION = 'Basic Hew76qE2hdfW23sD';
const END__POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const header = document.querySelector('.page-header');
const tripInfoContainer = header.querySelector('.trip-main');
const filterContainer = header.querySelector('.trip-controls__filters');

const main = document.querySelector('.page-main');
const tripEventsContainer = main.querySelector('.trip-events');

const tripInfoComponent = new TripInfoView();

const pointsModel = new PointsModel({
  PointsTripServer: new PointsApiService(END__POINT, AUTORIZATION),
});
const offersModel = new OffesModel();
const destinationsModel = new DestinationsModel();
const filterModel = new FiltersModel();

const btnAddNewPointComponent = new BtnAddNewPointView({ onClick: handleBtnAddNewPointClick });

render(btnAddNewPointComponent, tripInfoContainer);

render(tripInfoComponent, tripInfoContainer, RenderPosition.AFTERBEGIN);
// render(filterComponent, filterContainer);

const listPresenter = new ListPresenter({
  container: tripEventsContainer,
  pointsModel,
  offersModel,
  destinationsModel,
  filterModel,
  onNewPointDestroy: handleNewFormClose,
});

const filterPresenter = new FilterPresenter({
  filterContainer,
  filterModel,
  pointsModel
});

function handleBtnAddNewPointClick() {
  listPresenter.createPoint();
  btnAddNewPointComponent.element.disabled = true;
}

function handleNewFormClose() {
  btnAddNewPointComponent.element.disabled = false;
}

listPresenter.init();
filterPresenter.init();
pointsModel.init();
