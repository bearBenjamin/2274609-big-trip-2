import AbstractView from '../framework/view/abstract-view';
import { MessageNoEvent } from '../const';

const createTemplate = () => `<p class="trip-events__msg">
                              ${MessageNoEvent.EVERITHING}
                              </p>`;

export default class ListEmpty extends AbstractView {
  get template() {
    return createTemplate();
  }
}
