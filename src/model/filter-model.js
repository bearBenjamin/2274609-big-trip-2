import Observable from '../framework/observable';
import { FilterType } from '../const';

export default class FiltersModel extends Observable {
  #filter = FilterType.EVERITHING;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
