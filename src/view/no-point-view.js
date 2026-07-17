import AbstractView from '../framework/view/abstract-view';
import { MessageNoEvent } from '../const';

const createTemplate = (filterType) => `<p class="trip-events__msg">
                              ${MessageNoEvent[filterType]}
                              </p>`;

export default class ListEmpty extends AbstractView {
  #filterType = null;

  constructor({ filterType }) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return createTemplate(this.#filterType);
  }
}
