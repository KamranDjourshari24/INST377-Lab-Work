let slidePosition = 0;
const photo_slides = document.querySelectorAll('.carousel_item');
const totalSlides = photo_slides.length;

const nextButton = document.querySelector('.next-button')
nextButton.addEventListener('click', event => {
    console.log("Clicked next button!", event.target)
    moveSlide('next')
});

const prevButton = document.querySelector('.prev-button')
prevButton.addEventListener('click', event => {
    console.log("Clicked previous button!", event.target)
    moveSlide('previous')
});

function updateSlidePosition() {
    for (let slide of photo_slides) {
        slide.classList.remove('visible-img')
        slide.classList.add('hidden-img')
    }
    photo_slides[slidePosition].classList.add('visible-img')
}

function moveSlide(direction) {
    if (direction === 'next') {
        if (slidePosition === totalSlides - 1) {
            slidePosition = 0;
        } else {
            slidePosition++
        }
           
    } else if (direction === 'previous') {
        if (slidePosition === 0) {
            slidePosition = totalSlides - 1;
        } else {
            slidePosition--
        }
    }
    updateSlidePosition()
}