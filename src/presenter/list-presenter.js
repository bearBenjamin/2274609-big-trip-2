import ListTripEvents from '../view/list-trip-view.js';
import SortView from '../view/sort-view.js';
import ListEmpty from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import { sortTime, sortPrice, sortDay } from '../utils/point-utils.js';
import { SortType, UpdateType, UserAction } from '../const.js';

export default class ListPresenter {
  #listContainer = null;
  #sortComponent = null;
  #listEventComponent = new ListTripEvents();
  #currentSortType = SortType.DAY;

  #pointsModel = {};
  #offerModel = [];
  #destinationsModel = [];

  #listPointPresenters = new Map();
  // formEditComponent = new FormEditEvent();

  constructor({ container, pointsModel, offersModel, destinationsModel }) {
    this.#listContainer = container; // container - tripEventsContainer приходит из точки входа - контейнер для списка точек путешествия;
    this.#pointsModel = pointsModel;
    this.#offerModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.DAY:
        return [...this.#pointsModel.points].sort(sortDay);
      case SortType.TIME:
        return [...this.#pointsModel.points].sort(sortTime);
      case SortType.PRICE:
        return [...this.#pointsModel.points].sort(sortPrice);
    }
    return [...this.#pointsModel.point].sort(sortDay);
  }

  get offers() {
    return this.#offerModel.offers;
  }

  get destinations() {
    return this.#destinationsModel.destinations;
  }

  init() {
    this.#renderSort();
    this.#renderList();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortChange,
    });
    render(this.#sortComponent, this.#listContainer);
  }

  #renderList() {
    if (this.points.length === 0) {
      render(new ListEmpty(), this.#listContainer);
      return;
    }

    //отрисоваваю контейнер списка - <ul></ul>
    this.#renderContainerList();

    this.points.forEach((point) => {
      this.#renderPoint(point, this.offers, this.destinations);
    });
  }

  #renderContainerList() {
    render(this.#listEventComponent, this.#listContainer);
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

  #clearListPoint() {
    this.#listPointPresenters.forEach((presenter) => {
      presenter.destroy();
    });

    this.#listPointPresenters.clear();
  }

  #handleModelEvent = (updateType, data) => {
    console.log(updateType, data);
    // В зависимости от типа изменений решаем, что делать:
    // - обновить часть списка (например, когда поменялось описание)
    // - обновить список (например, когда удалили точку)
    // - обновить все отрисованное (например, при переключении фильтра)
    switch (updateType) {
      case UpdateType.PATCH:
        this.#listPointPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        break;
      case UpdateType.MAJOR:
        break;
    }
  };

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    // this.#sortPoints(sortType);
    this.#currentSortType = sortType;
    this.#clearListPoint();
    this.#renderList();
  };

  // #handlePointChange = (updatePoint) => {
  //   updateItem(this.points, updatePoint);
  //   this.#listPointPresenters.get(updatePoint.id).init(updatePoint);
  // };

  #handleViewAction = (actionType, updateType, update) => {
    console.log(actionType, updateType, update);
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case UserAction.UPDATE__POINT:
        this.#pointsModel.updatePoint(updateType, update);
        console.log('this.#pointsModel: ', this.#pointsModel);
        break;
      case UserAction.ADD__POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE__POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  #handleModeChange = () => {
    this.#listPointPresenters.forEach((presenter) => presenter.resetView());
  };
}
