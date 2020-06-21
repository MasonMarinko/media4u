// general elements
var heroEl = document.getElementById("hero");
var mediaSelectEl = document.getElementById("media-select");
var searchFormEl = document.getElementById("search-form");
var submitButtonEl = document.getElementById("submit-button");
var closeEl = document.getElementById("modal-close");
var panelTabsEl = document.getElementById('panel-tabs')
var moviePanelEl = document.getElementById('movie-panel')
var bookInputLabelEl = document.getElementById('book-input-label')
var bookPanelEl = document.getElementById('book-panel')
/* var musicPanelEl = document.getElementById('music-panel') */
var bookFormEl = document.getElementById('book-form')
var movieFormEl = document.getElementById('movie-form')
// var musicFormEl = document.getElementById('music-form')
var bookInterestTab = document.getElementById('book-tab')
var movieInterestTab = document.getElementById('movie-tab')
//var musicInterestTab = document.getElementById('music-tab')
// content section elements
var contentDisplayEl = document.getElementById("content-display");
var contentTitleEl = document.getElementById("content-title");
var postersWrapperEl = document.getElementById("posters-wrapper");
// movie elements
var movieTitleEl = document.getElementById("movie-title");
var searchGenreEl = document.getElementById("search-by-genre");
var yearInputEl = document.getElementById("search-by-year");
// book elements
var bookSearchByEl = document.getElementById("book-search-by");
var bookInputEl = document.getElementById("book-input")
// arrays
var bookArray = [];
var movieArray = [];
let movieResponseArray = [];
/* var musicArray = []; */

//***********************FORM SECTION******************************* *//

// function to check which media types are selected
// then send input to correct fetch functions
var formHandler = function (event) {
    event.preventDefault();
    postersWrapperEl.innerHTML = "";
    var selectedMedia = mediaSelectEl.value;
    // send user input to appropriate fetch function
    if (selectedMedia === "movies") {
        movieSearchHandler();
    } else if (selectedMedia === "books") {

        bookFetchHandler();
    }
    /* } else if (selectedMedia === "music") {

        // musicFetchHandler(); */
};


// switches between forms
const mediaSelectHandler = function () {
    switch (mediaSelectEl.value) {
        case "movies":
            movieFormEl.setAttribute('class', 'field');
            bookFormEl.setAttribute('class', 'is-hidden');
            // musicFormEl.setAttribute('class', 'is-hidden');
            break;
        case "books":
            movieFormEl.setAttribute('class', 'is-hidden');
            bookFormEl.setAttribute('class', 'field');
            // musicFormEl.setAttribute('class', 'is-hidden');
            break;
            /* case "music":
                document.getElementById('movie-form').setAttribute('class', 'is-hidden');
                document.getElementById('book-form').setAttribute('class', 'is-hidden');
                document.getElementById('music-form').setAttribute('class', 'field');
                break; */
    }
}

// fetch response modal alert
var fetchErrorCreator = function (response) {
    var isModal = document.getElementsByClassName("modal is-active error");
    console.log(isModal);
    if (isModal.length > 0) {
        return;
    } else {
        console.log(response);
        var modalEl = document.createElement("div");
        modalEl.className = "modal is-active error";
        var modalBackGroundEl = document.createElement("div");
        modalBackGroundEl.className = "modal-background";
        var modalCardEl = document.createElement("div");
        modalCardEl.className = "modal-card";
        // modal card head
        var modalHeadEl = document.createElement("header");
        modalHeadEl.className = "modal-card-head";
        modalHeadEl.id = "error-modal-head";
        var modalTitleEl = document.createElement("p");
        modalTitleEl.className = "modal-card-title";
        modalTitleEl.textContent = "Error";
        var modalCloseEl = document.createElement("button");
        modalCloseEl.className = "delete";
        modalCloseEl.id = "modal-close";
        modalCloseEl.setAttribute("aria-label", "close");
        // modal card content
        var modalBodyEl = document.createElement("section");
        modalBodyEl.className = "modal-card-body is-danger";
        // error message
        var modalDescTitleEl = document.createElement("h1");
        modalDescTitleEl.className = "has-text-weight-bold";
        modalDescTitleEl.textContent = "The following error has occurred:";
        var modalDescEl = document.createElement("p");
        modalDescEl.className = "pb-3";
        modalDescEl.textContent = response;
        // append modal elements to DOM
        modalEl.appendChild(modalBackGroundEl);
        modalHeadEl.appendChild(modalTitleEl);
        modalHeadEl.appendChild(modalCloseEl);
        modalCardEl.appendChild(modalHeadEl);
        modalEl.appendChild(modalCardEl);
        modalBodyEl.appendChild(modalDescTitleEl);
        modalBodyEl.appendChild(modalDescEl);
        modalCardEl.appendChild(modalBodyEl);
        heroEl.appendChild(modalEl);
        // event listener for close-modal
        modalCloseEl.addEventListener("click", closeModal)
    }
};

// dynamic text on the book form
const bookInputHandler = function () {

    if (bookSearchByEl.value === 'Keyword') {
        bookInputLabelEl.textContent = 'Keyword'
    } else {
        bookInputLabelEl.textContent = 'Author'
    }
}
//*****************END FORM SECTION **************************//

//*************** MOVIE SECTION*******************//
//============ MAIN search function that calls everything else for MOVIE TITLES!
// Function that takes all search criteria and will compound it
// together and send to the "movieFetch"/fetch request
var movieSearchHandler = function () {

    //======= Movie title checks if a title is entered and then returns a movie title they've selected
    var movieName = movieTitle(movieTitleEl.value);
    movieTitleEl.value = ""; //<== Check to see if it clears value and doesn't mess with anything, also change search element

    //======== Release date function, verifies if date is 4 digits, and beyond 1887 (first movie made in 1888) otherwise loops back============
    var releaseDate = releaseInput(yearInputEl.value);
    yearInputEl.value = "";

    // sends all inputs to fetch/movieFetch
    movieFetch(movieName, releaseDate) //<========== CALL TO FETCH, COMMENTED FOR NOW
}

var movieFetch = function (title, releaseYear) {
    movieArray = [];
    movieResponseArray = [];
    let returnedResponsesTracker = 0;
    for (var i = 1; i <= 100; i++) {
        var apiUrl =
            "https://api.themoviedb.org/3/search/movie?api_key=aafd4b8dcf6c14437ba0157bc3e6e116&language=en-US&page=" +
            i +
            "&query=" +
            title +
            "&primary_release_year=" +
            releaseYear +
            "&include_adult=false";
        fetch(apiUrl)
            .then(function (response) {
                if (response.ok) {
                    response.json().then(function (data) {
                        if (data.total_results == 0) {
                            displayContent(movieArray, 'movie');
                        } else {
                            returnedResponsesTracker++
                            responseArrayCreator(data, returnedResponsesTracker);
                        }
                    });
                } else {
                    fetchErrorCreator(response.statusText);
                }
            })
            .catch(function (error) {
                fetchErrorCreator("Unable to connect");
            });
    }
};

// Takes all the responses and returns one array
const responseArrayCreator = function (data, returnedResponsesTracker) {

    for (let i = 0; i < data.results.length; i++) {
        movieResponseArray.push(data.results[i])
    }

    if (returnedResponsesTracker >= 100) {
        genreCheck(movieResponseArray)
    }
}

//====== Function takes in data from fetch, and number(id) from genreConversion which will verify if movies that have been fetched match those genre ID's, if they do they are returned, if not they will no longer show.
var genreCheck = function (array) {

    var genreInput = searchGenreEl.value

    for (var i = 0; i < array.length; i++) {
        var genreInfo = array[i].genre_ids;

        if (genreInfo.includes(parseInt(genreInput))) {

            movieArray.push(array[i])

        } else if (genreInput === "any") {

            movieArray.push(array[i])

        }
    }

    movieArray = removeDuplicates(movieArray);
    displayContent(movieArray, 'movie');
}

// removes repeated movies
const removeDuplicates = function (array) {
    return array.filter((a, b) => array.indexOf(a) === b)
};

// function checks to make sure year is 4 digits long, and is beyond 1887 (first movie 1888) and returns a year/integer
var releaseInput = function (yearInput) {
    var dateInput = parseInt(yearInput); //<========Change to grab from HTML/Search Box
    var dateInputCombined = dateInput.toString();
    var currentYear = moment().year();

    if (dateInputCombined.length === 4 && dateInput > 1887 && dateInput <= currentYear) { // <====== first movie made in 1888, no need to search before then. Also verified after being parsed that the length is 4
        return dateInput
    } else {
        var dateInput = ""
        return "any"
    }
}

//==================== function takes in search result for movie title and returns answer to "movieFetchInformation, if user leaves blank then "any" is returned
//==================== this could also be an alert/modal if preferred.==================================//
var movieTitle = function (movieTitleInput) { //<====================== Ready
    if (movieTitleInput) {
        return movieTitleInput;
    } else if (movieTitleInput === "") {
        return "any"
        // alert("Please enter a movie title to search") //<=========================UPDATE and make a modal!
    }
}

//====================END MOVIE SECTION==========================//
//====================BOOK SECTION==========================//

// function to fetch book data using user input as parameter
var bookFetchHandler = function () {
    // clear books array from previous searches
    bookArray = [];
    // initiate apiUrl variable
    var apiUrl;
    // book input value
    var userInput = bookInputEl.value
    // check if searching for title or author
    var bookSearchByEl = document.getElementById("book-search-by");
    if (bookSearchByEl.value === "title") {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            userInput +
            "&maxResults=40&key=AIzaSyA2ONzDIFnpqYkH0ALMjMWuPbNh99zqNhw";
    } else {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            userInput +
            "+inauthor:" +
            userInput +
            "&maxResults=40&key=AIzaSyA2ONzDIFnpqYkH0ALMjMWuPbNh99zqNhw";
    }
    // fetch data from api URL
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    if (data.totalItems == 0) {
                        displayContent(bookArray, 'book')
                    } else {
                        // send data to function which will create object of
                        // relevent information
                        bookInputEl.value = "";
                        bookObjectCreator(data);
                    }

                });
            } else {
                fetchErrorCreator(response.statusText);
            }
        })
        .catch(function (error) {
            fetchErrorCreator("Unable to connect");
        });
};

var bookObjectCreator = function (data) {

    // cycle through data and add info to object
    for (i = 0; i < data.items.length; i++) {
        // get title information
        var title = data.items[i].volumeInfo.title;
        // get image url
        var imageUrl;
        var imagesLocation = data.items[i].volumeInfo.imageLinks;
        if (!imagesLocation) {
            imageUrl = "./assets/images/image-unavailable.jpg";
        } else {
            imageUrl = data.items[i].volumeInfo.imageLinks.thumbnail;
        };
        // get description
        var description = data.items[i].volumeInfo.description;
        if (!description) {
            description = "Description is unavailable for this book.";
        };
        // define "authors" location in data
        var authors = data.items[i].volumeInfo.authors;
        if (!authors) {
            authors = "Authors unavailable for this book."
        };
        // create book object
        var bookObject = {
            title: title,
            imageUrl: imageUrl,
            description: description,
            authors: authors,
        }
        // push book object to bookArray
        bookArray.push(bookObject);
    };
    // send bookObject to DOM element creator function
    displayContent(bookArray, 'book');

};

//===============END OF BOOK SECTION==========================//
//**************************Display Section******************************** */

var displayContent = function (array, type) {
    contentDisplayEl.classList.remove("is-hidden");

    if (array.length === 0) {
        contentTitleEl.textContent = "No results. Please try a different search.";

    } else {
        let title = type + "s"
        title = title.charAt(0).toUpperCase() + title.slice(1);
        contentTitleEl.textContent = title;

        for (i = 0; i < array.length; i++) {
            // create element to go inside postersWrapper
            var posterEl = document.createElement("div");
            // give element an id referencing its index in array
            posterEl.setAttribute("id", "index-" + i);
            posterEl.setAttribute('type', type);
            posterEl.addEventListener('click', modalCreator);
            // set styling for div
            posterEl.className = ("column is-one-fifth-desktop is-one-third-tablet is-half-mobile");
            // create div to hold img
            var imgWrapperEl = document.createElement("div");
            // give div class name image
            imgWrapperEl.className = "image pointer";
            // create img element
            var imageEl = document.createElement("img");

            if (type === 'movie') {
                getMovieImage(imageEl, array, imgWrapperEl);

            } else if (type === 'book') {
                getBookImage(array, imageEl, imgWrapperEl);
            }

            // append elements
            imgWrapperEl.appendChild(imageEl);
            posterEl.appendChild(imgWrapperEl);
            // append poster to postersWrapper to be displayed
            postersWrapperEl.appendChild(posterEl);
        }
    }

    // jump to content section
    contentDisplayEl.scrollIntoView();
};

var modalCreator = function (event) {
    // find out which object was clicked and get corresponding object from array

    var mediaIndex = event.currentTarget.id.replace("index-", "");

    let array;
    var mediaType = event.currentTarget.getAttribute('type')
    switch (mediaType) {
        case 'movie':
            array = movieArray
            break;
        case 'book':
            array = bookArray
            break;
    }

    var mediaObject = array[mediaIndex];

    // create modal elements
    var modalEl = document.createElement("div");
    modalEl.className = "modal is-active";
    var modalBackGroundEl = document.createElement("div");
    modalBackGroundEl.className = "modal-background";
    var modalCardEl = document.createElement("div");
    modalCardEl.className = "modal-card";

    // modal card head
    var modalHeadEl = document.createElement("header");
    modalHeadEl.className = "modal-card-head";
    var modalTitleEl = document.createElement("p");
    modalTitleEl.className = "modal-card-title";
    modalTitleEl.textContent = mediaObject.title;
    var modalCloseEl = document.createElement("button");
    modalCloseEl.className = "delete";
    modalCloseEl.id = "modal-close";
    modalCloseEl.setAttribute("aria-label", "close");

    // modal card body
    var modalBodyEl = document.createElement("section");
    modalBodyEl.className = "modal-card-body";

    // modal image
    var modalimageEl = document.createElement("p");
    modalimageEl.className = "image mb-3 modal-image";
    var imageEl = document.createElement("img");

    // interest button
    let interestButtonEl = document.createElement('button');
    interestButtonEl.id = "interest-button";
    interestButtonEl.classList = 'button';
    interestButtonEl.setAttribute('type', mediaType);
    interestButtonEl.setAttribute('data-id', event.currentTarget.id)
    interestButtonEl.textContent = 'Add to interests'

    // modal text containers
    var modalHeaderOneEl = document.createElement("h1");
    modalHeaderOneEl.className = "has-text-weight-bold mt-3";
    var modalTextOneEl = document.createElement("p");
    modalTextOneEl.className = "pb-3";
    var modalHeaderTwoEl = document.createElement("h1");
    modalHeaderTwoEl.className = "has-text-weight-bold";
    var modalTextTwoEl = document.createElement("p");

    // text and image content
    switch (mediaType) {
        case 'movie':
            if (!mediaObject.poster_path) {
                imageEl.setAttribute("src", "./assets/images/not-available.jpg")
            } else {
                imageEl.setAttribute("src", "http://image.tmdb.org/t/p/original" + mediaObject.poster_path);
            }
            modalHeaderOneEl.textContent = "Release Date: " + mediaObject.release_date;
            modalTextOneEl.textContent = mediaObject.description;

            modalHeaderTwoEl.textContent = "Movie Description:";
            modalTextTwoEl.textContent = mediaObject.overview;
            break;

        case 'book':
            imageEl.setAttribute("src", mediaObject.imageUrl);
            modalHeaderOneEl.textContent = "About the Book";
            modalTextOneEl.textContent = mediaObject.description;
            modalHeaderTwoEl.textContent = "Author(s):";
            modalTextTwoEl.textContent = mediaObject.authors;
            break;
    }


    // append modal elements to DOM
    modalEl.appendChild(modalBackGroundEl);
    modalHeadEl.appendChild(modalTitleEl);
    modalHeadEl.appendChild(modalCloseEl);
    modalCardEl.appendChild(modalHeadEl);
    modalEl.appendChild(modalCardEl);
    modalBodyEl.appendChild(modalimageEl);
    modalimageEl.appendChild(imageEl);
    modalimageEl.appendChild(interestButtonEl);
    modalBodyEl.appendChild(modalHeaderOneEl);
    modalBodyEl.appendChild(modalTextOneEl);
    modalBodyEl.appendChild(modalHeaderTwoEl);
    modalBodyEl.appendChild(modalTextTwoEl);
    modalCardEl.appendChild(modalBodyEl);
    contentDisplayEl.appendChild(modalEl);

    // event listeners
    interestButtonEl.addEventListener('click', saveInterest)
    modalCloseEl.addEventListener("click", closeModal)
};

//*********************End Display Section********************** //
//********************* Interest Section********************** //

// toggles visibility of interest panel
let interestToggleEl = document.getElementById('toggle-interest-panel')
interestToggleEl.addEventListener('click', function () {
    var interestPanelEl = document.getElementById('interest-panel')
    if (interestPanelEl.className === 'is-hidden') {
        interestPanelEl.classList = 'panel'
    } else {
        interestPanelEl.classList = 'is-hidden'
    }
});

// toggles visibility of panel tabs
const panelTabHandler = function (event) {
    switch (event.target.id) {
        case "movie-tab":
            moviePanelEl.removeAttribute('class');
            movieInterestTab.setAttribute('class', 'is-active');

            bookPanelEl.setAttribute('class', 'is-hidden');
            bookInterestTab.removeAttribute('class');

            //musicInterestTab.removeAttribute('class');
            //musicPanelEl.setAttribute('class', 'is-hidden');
            break;
        case "book-tab":
            bookPanelEl.removeAttribute('class');
            bookInterestTab.setAttribute('class', 'is-active');

            moviePanelEl.setAttribute('class', 'is-hidden');
            movieInterestTab.removeAttribute('class');

            //musicInterestTab.removeAttribute('class');
            //musicPanelEl.setAttribute('class', 'is-hidden');
            break;
        /* case "music-tab":
            document.getElementById('music-tab').setAttribute('class', 'is-active');
            movieInterestTab.removeAttribute('class');
            bookInterestTab.removeAttribute('class');
            musicPanelEl.removeAttribute('class');
            moviePanelEl.setAttribute('class', 'is-hidden');
            bookPanelEl.setAttribute('class', 'is-hidden');
            break; */
    }
}

// saves targeted interest into local storage
const saveInterest = function (event) {
    let targetEl = event.target

    let targetType = targetEl.getAttribute("type")
    let targetId = targetEl.getAttribute("data-id")
    targetId = targetId.split("-")
    targetId = targetId[1]

    let array;
    let key;
    switch (targetType) {
        case 'movie':
            array = movieArray
            key = 'savedMovies'
            break;
        case 'book':
            array = bookArray
            key = 'savedBooks'
            break;
    }

    let savedArray = JSON.parse(localStorage.getItem(`m4u-${key}`)) || [];
    let interestEl = array[targetId];
    savedArray.push(interestEl);
    localStorage.setItem(`m4u-${key}`, JSON.stringify(savedArray));

    updateInterestSection()
}

// updates the display in the interest panel
const updateInterestSection = function () {

    moviePanelEl.textContent = ''
    let savedMovies = JSON.parse(localStorage.getItem('m4u-savedMovies')) || []
    for (let i = 0; i < savedMovies.length; i++) {
        createInterestItem(savedMovies, i, "Movies");
    }
    bookPanelEl.textContent = ''
    let savedBooks = JSON.parse(localStorage.getItem('m4u-savedBooks')) || []
    for (let i = 0; i < savedBooks.length; i++) {
        createInterestItem(savedBooks, i, "Books")
    }
}

// creates an item to display in the interest panel
const createInterestItem = function (array, i, type) {
    let selectedPanelEl;
    switch (type) {
        case 'Movies':
            selectedPanelEl = moviePanelEl
            break;
        case 'Books':
            selectedPanelEl = bookPanelEl
            break;
    }
    let itemEl = document.createElement('div');
    itemEl.classList = 'panel-block container has-text-weight-semibold panel-list-item';
    itemEl.textContent = array[i].title;
    selectedPanelEl.appendChild(itemEl);
    createDeleteButton(itemEl, array, type);
}

// creates a delete button for an item in the interest panel
const createDeleteButton = function (itemEl, array, type) {
    deleteContainerEl = document.createElement('div');
    deleteContainerEl.className = 'ml-2';
    itemEl.appendChild(deleteContainerEl);
    deleteButtonEl = document.createElement('button');
    deleteButtonEl.className = 'delete';
    deleteContainerEl.appendChild(deleteButtonEl);

    deleteContainerEl.addEventListener('click', function () {
        for (let i = 0; i < array.length; i++) {
            if (array[i].title === itemEl.textContent) {
                array.splice(i, 1)
                localStorage.setItem(`m4u-saved${type}`, JSON.stringify(array))
                itemEl.remove();
                break;
            }
        }
    })
}


//***************End Interest Section**********************/
//***************Miscelaneous Functions**********************/

// function to close modals when close button is clicked
var closeModal = function (event) {
    var modalEl = event.target.closest(".is-active");
    modalEl.classList.remove("is-active");
}

// if the image in unavailable or doesn't exist, replace with placeholder and add text
const getMovieImage = function (imageEl, array, imgWrapperEl) {
    imagePath = array[i].poster_path
    if (!imagePath) {
        // set source of img element
        imageEl.setAttribute("src", "./assets/images/not-available.jpg");

        addTitleOverlay(array, imgWrapperEl);
    }
    else {
        // set source of img element
        var imageSrc = "http://image.tmdb.org/t/p/original" + imagePath;
        imageEl.setAttribute("src", imageSrc);
    }
}

// if the image in unavailable or doesn't exist, replace with placeholder and add title overlay
const getBookImage = function (array, imageEl, imgWrapperEl) {
    var imageSrc = array[i].imageUrl;

    imageEl.setAttribute("src", imageSrc);

    if (imageSrc === './assets/images/image-unavailable.jpg') {
        addTitleOverlay(array, imgWrapperEl);
    }
}

// adds a title overlay to placeholder images
const addTitleOverlay = function (array, imgWrapperEl) {
    var title = array[i].title;
    var titleOverlayEl = document.createElement('div');
    titleOverlayEl.className = 'title-overlay';
    titleOverlayEl.textContent = title;
    imgWrapperEl.appendChild(titleOverlayEl);
}

bookSearchByEl.addEventListener('change', bookInputHandler)
panelTabsEl.addEventListener('click', panelTabHandler);
mediaSelectEl.addEventListener("change", mediaSelectHandler);
searchFormEl.addEventListener("submit", formHandler);

updateInterestSection();
