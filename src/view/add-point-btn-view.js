import AbstractView from '../framework/view/abstract-view.js';

const createTemplate = () => `<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">
New event</button>`;

export default class BtnAddNewPointView extends AbstractView {
  #hanldeAddPointBtn = null;

  get template() {
    return createTemplate();
  }

  setСlickHandler(callback) {
    this.#hanldeAddPointBtn = callback;
    this.element.addEventListener('click', this.#clickHandler);
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#hanldeAddPointBtn();
  };
}
