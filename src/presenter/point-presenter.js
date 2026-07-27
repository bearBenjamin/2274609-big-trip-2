import PointTripEvent from '../view/point-trip-view';
import FormEditEvent from '../view/form-edit-view';
import { render, replace, remove } from '../framework/render';
import { UserAction, UpdateType } from '../const';
import { isEscapeKey } from '../utils/common';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export default class PointPresenter {
  #listEventContainer = null;
  #point = null;
  #offers = [];
  #destinations = [];
  #pointComponent = null;
  #formEditComponent = null;

  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  constructor({ listEventComponent, offers, destinations, onDataChange, onModeChange }) {
    this.#listEventContainer = listEventComponent;
    this.#offers = offers;
    this.#destinations = destinations;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;

    const prevPointComponent = this.#pointComponent;
    const prevFormEditComponent = this.#formEditComponent;

    this.#pointComponent = new PointTripEvent({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormEditBtnClick: () => {
        this.#replacePointToForm();
      },
      onFavoriteBtnClick: () => this.#handleFavoriteClick(),
    });

    this.#formEditComponent = new FormEditEvent({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#handleFormSubmit,
      onPointDeleteClick: this.#handleBtnDeleteClick,
      onFormBtnCloseClick: this.#handleFormBtnCloseClick,
    });

    if (prevPointComponent === null || prevFormEditComponent === null) {
      render(this.#pointComponent, this.#listEventContainer);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#formEditComponent, prevFormEditComponent.element);
    }

    remove(prevPointComponent);
    remove(prevFormEditComponent);
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {

      this.#formEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#formEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#formEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#formEditComponent.shake(resetFormState);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#formEditComponent);
  }

  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #escKeyDownHandler = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#formEditComponent.reset(this.#point);
      this.#replaceFormToPoint();
    }
  };

  #replaceFormToPoint() {
    replace(this.#pointComponent, this.#formEditComponent);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #replacePointToForm() {
    replace(this.#formEditComponent, this.#pointComponent);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE__POINT,
      UpdateType.PATCH,
      { ...this.#point, isFavorite: !this.#point.isFavorite }
    );
  };

  #handleFormSubmit = (point) => {
    //this.#replaceFormToPoint();
    this.#handleDataChange(
      UserAction.UPDATE__POINT,
      UpdateType.MINOR,
      point,
    );
  };

  #handleBtnDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE__POINT,
      UpdateType.MINOR,
      point
    );
  };

  #handleFormBtnCloseClick = () => {
    this.#formEditComponent.reset(this.#point);
    this.#replaceFormToPoint();
  };
}
