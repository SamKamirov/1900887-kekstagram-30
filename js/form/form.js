import {addValidators, validateForm, resetPristine} from './validate-form.js';
import {resetImageScale, scalePreview} from './scale-preview.js';
import {initSlider, resetSlider} from './add-effect.js';
import {sendData} from '../server/server.js';
import {onUploadError, onUploadSuccess, isError, isSuccess} from './upload-form.js';
import {isEscapeKey} from '../utils/utils.js';

const FILE_TYPES = ['jpeg', 'jpg', 'svg', 'png'];

const uploadForm = document.querySelector('.img-upload__form');
const uploadFormInput = document.querySelector('.img-upload__input');
const uploadFormEdit = document.querySelector('.img-upload__overlay');
const imgUploadCancelBtn = document.querySelector('.img-upload__cancel');
const submitBtn = document.querySelector('.img-upload__submit');
const imgUploadPreview = document.querySelector('.img-upload__preview img');
const imgPreview = document.querySelectorAll('.effects__preview');

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !evt.target.closest('.text__hashtags') && !evt.target.closest('.text__description') && !(isSuccess() || isError())) {
    evt.preventDefault();
    closeForm();
  }
};
const onUploadCancelClick = () => closeForm();

const disableSubmitBtn = (isDisabled) => {
  submitBtn.disabled = isDisabled;
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  disableSubmitBtn(true);
  const isValid = validateForm();
  if (isValid) {
    const formData = new FormData(evt.target);
    sendData(formData, onUploadSuccess, onUploadError);
  }
};
function closeForm() {
  uploadFormEdit.classList.add('hidden');
  if (!document.body.contains(document.querySelector('.success')) && !document.body.contains(document.querySelector('.error'))) {
    document.body.classList.remove('modal-open');
  }
  document.removeEventListener('keydown', onDocumentKeydown);
  resetPristine();
  resetSlider();
  resetImageScale();
  disableSubmitBtn(false);
}

const setUploadImage = () => {
  const file = uploadFormInput.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((type) => fileName.endsWith(type));

  if (matches) {
    imgUploadPreview.src = URL.createObjectURL(file);
    imgPreview.forEach((image) => {
      image.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
    });
  }
};

function openForm() {
  setUploadImage();
  document.addEventListener('keydown', onDocumentKeydown);
  imgUploadCancelBtn.addEventListener('click', onUploadCancelClick);
  uploadForm.addEventListener('submit', onFormSubmit);
  document.body.classList.add('modal-open');
  uploadFormEdit.classList.remove('hidden');
}

const handleInputChange = () => openForm();

const uploadImage = () => {
  initSlider();
  addValidators();
  scalePreview();
  uploadFormInput.addEventListener('change', handleInputChange);
};

export {uploadImage, closeForm, disableSubmitBtn};
