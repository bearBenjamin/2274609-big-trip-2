import { render, remove, replace, RenderPosition } from '../framework/render';
import TripInfoView from '../trip-info-view.js';
import { UpdateType } from '../const.js';

export default class TripInfoPresenter {
  #container = null;
  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripInfoComponent = null;

  constructor({ tripInfoContainer, pointsModel, offersModel, destinationsModel }) {
    this.#container = tripInfoContainer;
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#offersModel.addObserver(this.#handleModelEvent);
    this.#destinationsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    return [...this.#pointsModel.points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
  }

  init() {
    const points = this.points;

    if (this.#offersModel.offers.length === 0 || this.#destinationsModel.destinations.length === 0 || points.length === 0) {
      if (this.#tripInfoComponent !== null) {
        remove(this.#tripInfoComponent);
        this.#tripInfoComponent = null;
      }
      return;
    }

    const prevInfoComponent = this.#tripInfoComponent;

    this.#tripInfoComponent = new TripInfoView({
      points,
      dataOffers: this.#offersModel.offers,
      dataDestinations: this.#destinationsModel.destinations,
    });

    if (prevInfoComponent === null) {
      render(this.#tripInfoComponent, this.#container, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this.#tripInfoComponent, prevInfoComponent);
    remove(prevInfoComponent);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.INIT || updateType === UpdateType.MAJOR || updateType === UpdateType.MINOR) {
      this.init();
    }
  };
}
