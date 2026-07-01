import ListTripEvents from '../view/list-trip-view.js';
import PointTripEvent from '../view/point-trip-view.js';
import FormEditEvent from '../view/form-edit-view.js';
import SortView from '../view/sort-view.js';
// import ListEmpty from '../view/no-point-view.js'; // - ДЗ 4.17
import { render, replace } from '../framework/render.js';

export default class ListPresenter {
  #listContainer = null;
  #listEventComponent = new ListTripEvents();
  #sortComponent = new SortView();

  #pointsModel = {};
  #listPoints = [];
  #listOffers = [];
  #listDestinations = [];
  // formEditComponent = new FormEditEvent();

  constructor({ container, pointsModel }) {
    this.#listContainer = container; // container - tripEventsContainer приходит из точки входа - контейнер для списка точек путешествия;
    this.#pointsModel = pointsModel; // массив точек путешествия;
  }

  init() {
    // делаю копию массива точек, чтобы случайно не мутировать данные - это временное решение
    this.#listPoints = [...this.#pointsModel.points];
    this.#listOffers = [...this.#pointsModel.offers];
    this.#listDestinations = [...this.#pointsModel.destinations];

    this.#renderList();
  }

  #renderList() {
    // if (this.#listPoints.length === 0) {
    //   render(new ListEmpty(), this.#listContainer);
    //   return;
    // }

    render(this.#sortComponent, this.#listContainer);

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
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
      }
    };

    const pointComponent = new PointTripEvent({
      point,
      offers,
      destinations,
      onFormEditBtnClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const formEditComponent = new FormEditEvent({
      point,
      offers,
      destinations,
      onFormSubmit: () => { },
      onFormBtnCloseClick: () => replaceFormToPoint(),
    });

    function replacePointToForm() {
      replace(formEditComponent, pointComponent);
    }

    function replaceFormToPoint() {
      replace(pointComponent, formEditComponent);
      document.removeEventListener('keydown', escKeyDownHandler);
    }

    render(pointComponent, this.#listEventComponent.element);
  }
}
