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

const tripInfoComponent = new TripInfoView();

const pointsModel = new PointsModel({
  PointsTripServer: new PointsApiService(END__POINT, AUTORIZATION),
});
const offersModel = new OffersModel({
  offersTripServer: new OffersApiService(END__POINT, AUTORIZATION)
});
const destinationsModel = new DestinationsModel({
  destinationsTripServer: new DestinationsApiService(END__POINT, AUTORIZATION),
});
const filterModel = new FiltersModel();

const btnAddNewPointComponent = new BtnAddNewPointView({ onClick: handleBtnAddNewPointClick });

// render(btnAddNewPointComponent, tripInfoContainer); возможно это было более правильно -> перенес отрисовку кнопки в init pointModel

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
pointsModel.init()
  .finally(() => {
    render(btnAddNewPointComponent, tripInfoContainer); // так себе решение наверное
  });
destinationsModel.init();
offersModel.init();
