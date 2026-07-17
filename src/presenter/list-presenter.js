import ListTripEvents from '../view/list-trip-view.js';
import SortView from '../view/sort-view.js';
import ListEmpty from '../view/no-point-view.js';
import PointPresenter from './point-presenter.js';
import { render } from '../framework/render.js';
import { updateItem } from '../utils/common.js';
import { sortTime, sortPrice, sortDay } from '../utils/point-utils.js';
import { SortType } from '../const.js';

export default class ListPresenter {
  #listContainer = null;
  #sortComponent = null;
  #listEventComponent = new ListTripEvents();
  #currentSortType = SortType.DAY;

  #pointsModel = {};
  #offerModel = [];
  #destinationsModel = [];
  // #listPoints = [];
  // #sourcedListPoints = [];
  // #listOffers = [];
  // #listDestinations = [];

  #listPointPresenters = new Map();
  // formEditComponent = new FormEditEvent();

  constructor({ container, pointsModel, offersModel, destinationsModel }) {
    this.#listContainer = container; // container - tripEventsContainer приходит из точки входа - контейнер для списка точек путешествия;
    this.#pointsModel = pointsModel;
    this.#offerModel = offersModel;
    this.#destinationsModel = destinationsModel;
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
    // this.#listPoints = [...this.#pointsModel.points].sort(sortDay); // в моках даты формируются случайно поэтому сортирую
    // this.#listOffers = [...this.#pointsModel.offers];
    // this.#listDestinations = [...this.#pointsModel.destinations];
    // this.#sourcedListPoints = [...this.#pointsModel.points].sort(sortDay); // в моках даты формируются случайно поэтому сортирую

    this.#renderSort();
    this.#renderList();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortChange,
    });
    render(this.#sortComponent, this.#listContainer);
  }

  // #sortPoints(sortType) {
  //   switch (sortType) {
  //     case SortType.TIME:
  //       this.#listPoints.sort(sortTime);
  //       break;
  //     case SortType.PRICE:
  //       this.#listPoints.sort(sortPrice);
  //       break;
  //     default:
  //       this.#listPoints = [...this.#sourcedListPoints]; // в моках даты как бог на душу послал поэтому и здесь соритрую
  //   }

  //   this.#currentSortType = sortType;
  // }

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

    // for (let i = 0; i < this.#listPoints.length; i += 1) {
    //   this.#renderPoint(
    //     this.#listPoints[i],
    //     this.#listOffers,
    //     this.#listDestinations,
    //   );
    // }
  }

  #renderContainerList() {
    render(this.#listEventComponent, this.#listContainer);
  }

  #renderPoint(point, offers, destinations) {
    const pointPresenter = new PointPresenter({
      listEventComponent: this.#listEventComponent.element,
      offers,
      destinations,
      onDataChange: this.#handlePointChange,
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

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    // this.#sortPoints(sortType);
    this.#currentSortType = sortType;
    this.#clearListPoint();
    this.#renderList();
  };

  #handlePointChange = (updatePoint) => {
    updateItem(this.points, updatePoint);
    // this.#listPoints = updateItem(this.#listPoints, updatePoint);
    // this.#sourcedListPoints = updateItem(this.#sourcedListPoints, updatePoint);
    this.#listPointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handleModeChange = () => {
    this.#listPointPresenters.forEach((presenter) => presenter.resetView());
  };
}
