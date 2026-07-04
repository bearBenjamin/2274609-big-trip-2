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
  #listEventComponent = new ListTripEvents();
  // #sortComponent = new SortView();
  #sortComponent = null;

  #pointsModel = {};
  #listPoints = [];
  #listOffers = [];
  #listDestinations = [];
  #listPointPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedListPoints = [];
  // formEditComponent = new FormEditEvent();

  constructor({ container, pointsModel }) {
    this.#listContainer = container; // container - tripEventsContainer приходит из точки входа - контейнер для списка точек путешествия;
    this.#pointsModel = pointsModel; // массив точек путешествия;
  }

  init() {
    // делаю копию массива точек, чтобы случайно не мутировать данные - это временное решение
    this.#listPoints = [...this.#pointsModel.points].sort(sortDay); // в моках даты формируются случайно поэтому сортирую
    this.#listOffers = [...this.#pointsModel.offers];
    this.#listDestinations = [...this.#pointsModel.destinations];
    this.#sourcedListPoints = [...this.#pointsModel.points].sort(sortDay); // в моках даты формируются случайно поэтому сортирую

    this.#renderSort();
    this.#renderList();
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      onSortTypeChange: this.#handleSortChange,
    });
    render(this.#sortComponent, this.#listContainer);
  }

  #sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#listPoints.sort(sortTime);
        break;
      case SortType.PRICE:
        this.#listPoints.sort(sortPrice);
        break;
      default:
        this.#listPoints = [...this.#sourcedListPoints]; // в моках даты как бог на душу послал поэтому и здесь соритрую
    }

    this.#currentSortType = sortType;
  }

  #handleSortChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoints(sortType);
    this.#clearListPoint();
    this.#renderList();
  };

  #renderList() {
    if (this.#listPoints.length === 0) {
      render(new ListEmpty(), this.#listContainer);
      return;
    }

    //отрисоваваю контейнер списка - <ul></ul>
    render(this.#listEventComponent, this.#listContainer);

    for (let i = 0; i < this.#listPoints.length; i += 1) {
      this.#renderPoint(
        this.#listPoints[i],
        this.#listOffers,
        this.#listDestinations,
      );
    }
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

  #handlePointChange = (updatePoint) => {
    this.#listPoints = updateItem(this.#listPoints, updatePoint);
    this.#sourcedListPoints = updateItem(this.#sourcedListPoints, updatePoint);
    this.#listPointPresenters.get(updatePoint.id).init(updatePoint);
  };

  #handleModeChange = () => {
    this.#listPointPresenters.forEach((presenter) => presenter.resetView());
  };
}
