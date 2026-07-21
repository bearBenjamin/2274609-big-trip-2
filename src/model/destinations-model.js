import Observable from '../framework/observable';

export default class DestinationsModel extends Observable {
  #destinationsTripServer = null;
  #destinations = [];

  constructor({ destinationsTripServer }) {
    super();
    this.#destinationsTripServer = destinationsTripServer;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      this.#destinations = await this.#destinationsTripServer.destinations;
    } catch (err) {
      this.#destinations = [];
    }
  }
}
