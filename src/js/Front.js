/* eslint-disable */

let slideIndex = 0;
showSlides();
redirect();

function showSlides() {
  let i;
  let slides = document.getElementsByClassName('mySlides');
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = 'none';
  }
  slideIndex++;
  if (slideIndex > slides.length) {slideIndex = 1}
  slides[slideIndex-1].style.display = 'block';
  setTimeout(showSlides, 3000);
} 
/* eslint-enable */

function redirect() {
  const orderButton = document.getElementById('order-button');
  const bookButton = document.getElementById('book-button');

  orderButton.addEventListener('click', function() {
    window.location.href = 'front.html#/order';

  });

  bookButton.addEventListener('click', function() {
    window.location.href = 'front.html#/booking';
  });
}