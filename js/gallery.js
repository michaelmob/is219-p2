// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
var mRequest = new XMLHttpRequest();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
var mUrl = 'images.json';

// Slideshow interval
var mSlideshowInterval = 5000;

// Store interval
var mInterval;


// Elements
var $photo = document.querySelector('#photo');
var $details = document.querySelector('.details');
var $more = document.querySelector('.moreIndicator');
var $prev = document.querySelector('#prevPhoto');
var $next = document.querySelector('#nextPhoto');


/*
 * Start image slideshow.
 */
function startSlideshowInterval() {
  mInterval = setInterval(function() {
    mCurrentIndex++;
    swapPhoto();
  }, mSlideshowInterval);
}


/*
 * Clear Interval and restart slideshow.
 */
function resetSlideshowInterval() {
  clearInterval(mInterval);
  startSlideshowInterval();
}



/*
 * Set $photo img property with current image index.
 */
function swapPhoto() {
  // Wrap around to end of array
  if (mCurrentIndex < 0)
    mCurrentIndex = mImages.length - 1;

  // Wrap around to beginning of array
  else if (mCurrentIndex >= mImages.length)
    mCurrentIndex = 0;

  // Set photo image url
  $photo.src = mImages[mCurrentIndex].img;

  // Set photo details
  $details.querySelector(".location").innerHTML =
    "<strong>Location: </strong>" + mImages[mCurrentIndex].location;
  $details.querySelector(".description").innerHTML =
    "<strong>Description: </strong>" + mImages[mCurrentIndex].description;
  $details.querySelector(".date").innerHTML =
    "<strong>Date: </strong>" + mImages[mCurrentIndex].date;
}


/*
 * Get name of JSON file to fetch from (?json=images.json).
 */
function GetJSONFileName() {
  // Match ?json=(.*?) from window.location.search
  const match = window.location.search.matchAll(/(?!\?\&)json=(.*?)(?:&|$)/gm)
    .next().value;

  // No matches?
  if (match === undefined)
    return;

  return match[1];
}


/*
 * Create GalleryImage object to be inserted into mImages.
 */
function GalleryImage(image) {
  return {
    location: image.imgLocation,
    description: image.description,
    date: image.date,
    img: image.imgPath
  };
}


window.addEventListener('load', function() {
  // Run when request is complete
  mRequest.onload = function(e) {
    // Only continue if request was successful
    if (e.target.status !== 200)
      return;

    // Attempt to parse response
    mJson = JSON.parse(e.target.responseText);
    if (typeof mJson.images === undefined)
      return;

    // Add images to mImage
    mJson.images.forEach(function(image) {
      mImages.push(GalleryImage(image));
    });

    swapPhoto();
    startSlideshowInterval();
  };

  // Create and send GET request
  mRequest.open('GET', '/' + (GetJSONFileName() || mUrl), true);
  mRequest.send();

});


/*
 * Previous photo button click.
 */
$next.onclick = function() {
  mCurrentIndex++;
  swapPhoto();
  resetSlideshowInterval();
};


/*
 * Previous photo button click.
 */
$prev.onclick = function() {
  mCurrentIndex--;
  swapPhoto();
  resetSlideshowInterval();
};


/*
 * More button click.
 */
$more.onclick = function() {
  $more.classList.toggle('active');

  if ($more.classList.contains('active'))
    $($details).slideDown();
  else
    $($details).slideUp();
};
