
// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
  return (
    window.requestAnimationFrame || window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame || function(callback) {
      window.setTimeout(callback, 1000 / 60);
    }
  );
})();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
  requestAnimFrame(animate);
  var currentTime = new Date().getTime();
  if (mLastFrameTime === 0) {
    mLastFrameTime = currentTime;
  }

  if ((currentTime - mLastFrameTime) > mWaitTime) {
    swapPhoto();
    mLastFrameTime = currentTime;
  }
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {
  //Add code here to access the #slideShow element.
  //Access the img element and replace its source
  //with a new image from your images array which is loaded 
  //from the JSON string
  console.log('swap photo');
}

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


// Elements
var $photo = document.querySelector('#photo');
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
  };

  // Create and send GET request
  mRequest.open('GET', '/' + (GetJSONFileName() || mUrl), true);
  mRequest.send();
});
