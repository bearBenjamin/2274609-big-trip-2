import AbstractView from '../framework/view/abstract-view.js';

const createServerErrorTemplate = () => (
  `<p class="trip-events__msg">
    Failed to load latest route information
  </p>`
);

export default class ServerErrorView extends AbstractView {
  get template() {
    return createServerErrorTemplate();
  }
}
