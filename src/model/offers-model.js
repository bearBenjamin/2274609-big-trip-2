import Observable from '../framework/observable';
import { UpdateType } from '../const';

export default class OffersModel extends Observable {
  #offersTripServer = null;
  #offers = [];

  constructor({ offersTripServer }) {
    super();
    this.#offersTripServer = offersTripServer;
  }

  get offers() {
    return this.#offers;
  }

  async init() {
    try {
      this.#offers = await this.#offersTripServer.offers;
    } catch (err) {
      this.#offers = [];
    }

    this._notify(UpdateType.INIT);
  }
}
