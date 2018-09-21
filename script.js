console.log('Script Loaded.')

// Define Global Variables

  // String used to build the queryString from
var API_STRING = 'https://api.giphy.com/v1/gifs/search?api_key=aQEL7kkkxlgFj1n4VjjY3RVRFTETGYVP&limit=10&q='

  // Reference to the html input for adding a search term
var searchTermInput = $('.search-term-input');

  // Reference to the sidebar element that contains the search buttons
var sideBar = $('.sidebar');

var gifContainer = $('.gif-images');


// Function used to assign event listeners to elements on initial page load
_appSetup();


/**
 *  Function Definitions
 **/

function _appSetup() {
  // Add event listener for form submission
  $('#search-term-form').on( 'submit', addSearchButton );

  // Add event listener for search button click
  $('.search-btn').on( 'click', handleSearch );
}

// Function to take a search term and return an html button using that term
function buildSearchButton( searchTerm ) {
  var newButton = $( `<button> ${searchTerm} </button>` ); // Create the button element
  newButton.addClass( 'search-btn' );                      // Add css class to button
  newButton.attr( 'data-term', searchTerm );               // Add data attribute to hold term
  newButton.on( 'click', handleSearch );                   // Attach event listener
  return newButton;                                        // return finished button
};

// Add a new search button to the DOM
function addSearchButton( event ) {
  event.preventDefault();   // Prevent the form from resubmitting the page

  var newTerm = searchTermInput.val().trim()  // Collect the new search term

  searchTermInput.val('');    // Clear the input field

  var button = buildSearchButton( newTerm );  // Use function to create the element
  sideBar.append( button );   // Append the new button to the HTML document
}


// Handles submitting a search to GiphyAPI
function handleSearch() {
  var term = this.dataset.term; // Gather the term from the button

  var queryURL = API_STRING + term;  // Build the query using the API_STRING and term

  fetch( queryURL, {method: 'GET'} )  // Send a 'GET' Ajax request to Giphy API
    .then( function( result ) {       // Catch the response object
      return result.json();           // Parse the response into a javascript object
    })
    .then( handleApiResponse )
}


// Function to take term entered by user and create a search button


// Handles the processing of the data returned from the GiphyAPI
function handleApiResponse( response ) {
  var gifUrls = extractUrls( response.data );  // Get the URLs we need using our function
  var imgs = buildImgs( gifUrls );          // Build an array of our img elements with our function

  gifContainer.empty();         // Clear out any previous images
  gifContainer.append( imgs );  // Add the array of images to the DOM
}

// Builds the img elements from the urlData
function buildImgs( urlData ) {
  var imgArray = [];    // Create an array outside of the loop to hold our data.

  for ( var i = 0; i < urlData.length; i++ ) {    // Define loop to iterate over urlData array
    var container = $('<figure>');      // Create figure element that wraps the img
    container.addClass( 'gif-image-container' );    // Add css class to element

    var img = $('<img>');   // Create img element
    img.attr( 'src', urlData[i].still );              // Add the src attribute
    img.attr( 'data-state', 'still' );                // Add the data-state attribute
    img.attr( 'data-still', urlData[i].still );       // Add the still url as a data variable
    img.attr( 'data-animate', urlData[i].animate );   // Add the animated url as a data variable

    container.on( 'click', handleClickGif)    // Add the click event listener to the figure element

    container.append( img );                  // Put the img inside of the figure
    imgArray.push( container );               // Push the figure which contains the img into our array
  }
  return imgArray;    // After the loop, return the array
}


// Extracts URLs and returns an array containing two URLs for each GIF
function extractUrls( collection ) {
  var gifData = [];   // Array to hold the objects containing the URLs

  for ( var i = 0; i < collection.length; i++ ) {   // Define our loop to iterate over the collection
    var item = collection[i].images;    // Abstract the data into a variable for less typing

    var urls = {                        // Create a temp object to hold the urls for this gif
      still: item.downsized_still.url,  // Save the still url under the key 'still'
      animate: item.downsized.url,      // Save the animated url under the key 'animate'
    }

    gifData.push( urls );       // Push our temp object into the array defined outside the loop
  }
  return gifData;   // Once the loop is finished, return the completed array
}

// Handles the playing and pausing of gif animation
function handleClickGif( event ) {
  var gif = event.target;     // Grab the target of the click event ( the img element )

  if ( gif.dataset.state === 'still' ) {    // If the state of the gif is still
    gif.dataset.state = 'animated'          // Set its state to 'animated'
    gif.src = gif.dataset.animate;          // Switch the src of the img to the animated url
  } else {
    gif.dataset.state = 'still';            // Otherwise set it's state to still
    gif.src = gif.dataset.still;            // And replace the src with the still url
  }
}

