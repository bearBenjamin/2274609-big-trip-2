import Observable from '../framework/observable';
import { UpdateType } from '../const';
// import { generatePoint } from '../mock/point';

// const POINT__COUNT = 4;

export default class PointsModel extends Observable {
  #pointsTripServer = null;
  #points = [];
  // #points = Array.from({ length: POINT__COUNT }, generatePoint);

  constructor({ PointsTripServer }) {
    super();
    this.#pointsTripServer = PointsTripServer;
    console.log(this.#pointsTripServer);

    this.#pointsTripServer.points.then((points) => {
      console.log('points: ', points.map(this.#adaptToClient));
    });
  }

  get points() {
    return this.#points;
  }

  async init() {
    try {
      const points = await this.#pointsTripServer.poinst;
      this.#points = points.map(this.#adaptToClient);
    } catch (err) {
      this.#points = [];
      /* !!!
      вот здесь надо будет обрабатывать ошибку сервера и отрисовку ошибки сервера
      !!! */
    }

    this._notify(UpdateType.INIT);
  }

  updatePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this.#points = [
      update,
      ...this.#points
    ];

    this._notify(updateType, update);
  }

  deletePoint(updateType, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];

    this._notify(updateType);
  }

  #adaptToClient(point) {
    const adaptedPoint = {
      ...point,
      price: point['base_price'],
      dateFrom: point['date_from'],
      dateTo: point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
