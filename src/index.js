import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const API_KEY = '29781225-270ed18ae1ae383a725fedf91';
const BASIC_URL = `https://pixabay.com/api/?key =${API_KEY}&q=`;
const searchFields = '&image_type=photo&orientation=horizontal&safesearch=true';

const imgBox = document.querySelector('.gallery');
