import ListTripEvents from '../view/list-trip-view.js';
import SortView from '../view/sort-view.js';
import ListEmpty from '../view/no-point-view.js';
import ServerErrorView from '../view/server-error-view.js';
import PointPresenter from './point-presenter.js';
import AddNewPointPresenter from './add-new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import { render, remove } from '../framework/render.js';
import { sortTime, sortPrice, sortDay } from '../utils/point-utils.js';
import { filter } from '../utils/filter-utils.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';

export default class ListPresenter {
  #listContainer = null;
  #headerContainer = null;
  #btnAddNewPointComponent = null;

  #sortComponent = null;
  #currentSortType = SortType.DAY;
  #filterType = FilterType.EVERITHING;

  #newPointPresenter = null;
  #isLoading = true;

  #pointsModel = {};
  #offerModel = [];
  #destinationsModel = [];
  #filtersModel = [];

  #listEventComponent = new ListTripEvents();
  #loadingComponent = new LoadingView();
  #listEmptyComponent = null;
  #serverErrorComponent = new ServerErrorView();
  #isServerError = false;

  #listPointPresenters = new Map();

  constructor({ container, headerContainer, btnAddNewPointComponent, pointsModel, offersModel, destinationsModel, filterModel }) {
    this.#listContainer = container; // container - tripEventsContainer приходит из точки входа - контейнер для списка точек путешествия;
    this.#headerContainer = headerContainer;
    this.#btnAddNewPointComponent = btnAddNewPointComponent;
    this.#pointsModel = pointsModel;
    this.#offerModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#filtersModel = filterModel;

    this.#newPointPresenter = new AddNewPointPresenter({
      container: this.#listEventComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewFormClose,
      getOffers: () => this.offers,
      getDestinations: () => this.destinations,
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offerModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
    this.#filtersModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#filterType = this.#filtersModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#filterType](points);

    switch (this.#currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortDay);
      case SortType.TIME:
        return filteredPoints.sort(sortTime);
      case SortType.PRICE:
        return filteredPoints.sort(sortPrice);
    }
    return filteredPoints.sort(sortDay);
  }

  get offers() {
    return this.#offerModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  async init() {
    this.#renderList();

    try {
      await Promise.all([
        this.#destinationsModel.init(),
        this.#offerModel.init(),
        this.#pointsModel.init()
      ]);
    } catch (err) {
      this.#isServerError = true;
    } finally {
      this.#isLoading = false;
      this.#renderList();
      this.#renderNewEventButton();
    }
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filtersModel.setFilter(UpdateType.MAJOR, FilterType.EVERITHING);
    this.#newPointPresenter.init();
  }

  #renderNewEventButton() {
    if (this.#isServerError) {
      this.#btnAddNewPointComponent.element.disabled = true;
    } else {
      this.#btnAddNewPointComponent.setСlickHandler(this.#handleBtnAddNewPointClick);
      this.#btnAddNewPointComponent.element.disabled = false;
    }
  }

  #renderSort() {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortChange,
    });
    render(this.#sortComponent, this.#listContainer);
  }

  #renderList() {
    if (this.#isServerError) {
      remove(this.#loadingComponent);
      render(this.#serverErrorComponent, this.#listContainer);
      return;
    }

    if (this.#isLoading) {
      this.#renderLoading();
      this.#btnAddNewPointComponent.element.disabled = true;
      return;
    }

    if (this.offers.length === 0 || this.destinations.length === 0) {
      remove(this.#loadingComponent);
      render(this.#serverErrorComponent, this.#listContainer);
      this.#btnAddNewPointComponent.element.disabled = true;
      return;
    }

    remove(this.#loadingComponent);
    this.#btnAddNewPointComponent.element.disabled = false;

    if (this.points.length === 0) {
      this.#renderNoPoint();
      return;
    }

    this.#renderSort();
    remove(this.#listEmptyComponent);
    this.#renderContainerList();

    this.points.forEach((point) => {
      this.#renderPoint(point, this.offers, this.destinations);
    });
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#listContainer);
  }

  #renderContainerList() {
    render(this.#listEventComponent, this.#listContainer);
  }

  #renderNoPoint() {
    this.#listEmptyComponent = new ListEmpty({ filterType: this.#filterType });
    render(this.#listEmptyComponent, this.#listContainer);
  }

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      listEventComponent: this.#listEventComponent.element,
      offers,
      destinations,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });

    pointPresenter.init(point);

    this.#listPointPresenters.set(point.id, pointPresenter);
  }

  #clearListPoint({ resetSortType = false } = {}) {
    this.#newPointPresenter.destroy();

    this.#listPointPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#listPointPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    if (this.#listEmptyComponent) {
      remove(this.#listEmptyComponent);
    }

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#listPointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearListPoint();
        this.#renderList();
        break;
      case UpdateType.MAJOR:
        this.#clearListPoint({ resetSortType: true });
        this.#renderList();
        break;
      case UpdateType.INIT:
        this.#renderList();
        break;
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#clearListPoint();
    this.#renderList();
  };

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE__POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD__POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE__POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#listPointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleBtnAddNewPointClick = () => {
    this.createPoint();
    this.#btnAddNewPointComponent.element.disabled = true;
  };

  #handleNewFormClose = () => {
    this.#btnAddNewPointComponent.element.disabled = false;
  };
}
