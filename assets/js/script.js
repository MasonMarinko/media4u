// general elements
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
var booksArray = [];
var movieArray = [];
/* var musicArray = []; */
/* var savedMusic = []; */
var savedMovies = [];
var savedBooks = [];




// function to check which media types are selected
// then send input to correct fetch functions
var formHandler = function (event) {
    event.preventDefault();

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
            movieFormEl.setAttribute('class', 'is-hidden');
            bookFormEl.setAttribute('class', 'is-hidden');
            musicFormEl.setAttribute('class', 'field');
            break; */
    }
}

// MOVIE SECTION
//============= Don't forget to add query locators in order to grab answers below



// NEED TO ADD INPUTS INTO FETCH

var userSearch = function (title, releaseYear) {
    for (var i = 1; i < 20; i++) {
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
                        genreCheck(data)
                    });
                } else {
                    alert("Error: " + response.statusText + '. ' + 'Please make sure to enter valid response'); //<==== replace with modal
                }
            })

            .catch(function (error) {
                alert("Unable to connect to Movie Database, please try again."); //<========== Replace alert with MODAL
            });
    }
};


//====== Function takes in data from fetch, and number(id) from genreConversion which will verify if movies that have been fetched match those genre ID's, if they do they are returned, if not they will no longer show.
var genreCheck = function (resultArray) {
    var genreInput = searchGenreEl.value
    var resultLength = resultArray.results.length;
    var resultId = resultArray.results;

    movieArray = [];

    for (var i = 0; i < resultLength; i++) {
        var genreInfo = resultId[i].genre_ids;

        if (genreInfo.includes(parseInt(genreInput))) {

            movieArray.push(resultId[i])

        } else if (genreInput === "any") {

            movieArray.push(resultId[i])

        }
    }

    displayContent(movieArray, 'movie')
}

//=================Show movie posters based on results==============//
var displayContent = function (array, type) {
    contentDisplayEl.classList.remove("is-hidden");
    postersWrapperEl.innerHTML = "";

    let title = type + "s"
    title = title.charAt(0).toUpperCase() + title.slice(1);
    contentTitleEl.textContent = title;

    for (i = 0; i < array.length; i++) {
        // create element to go inside postersWrapper
        var posterEl = document.createElement("div");
        // give element an id referencing its index in array
        posterEl.setAttribute("id", "index-" + i);
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
            posterEl.addEventListener("click", movieModalCreator);

        } else if (type === 'book') {
            getBookImage(array, imageEl);
            posterEl.addEventListener('click', bookModalCreator);
        }

        // append elements
        imgWrapperEl.appendChild(imageEl);
        posterEl.appendChild(imgWrapperEl);
        // append poster to postersWrapper to be displayed
        postersWrapperEl.appendChild(posterEl);

    }
    // jump to content section
    contentDisplayEl.scrollIntoView();
};




//============ MAIN search function that calls everything else for MOVIE TITLES! ==============================//
//============= Function that takes all search criteria and will compound it =================================//
//============ together and send to the "userSearch"/fetch request============================================//
var movieSearchHandler = function () {

    //======= Movie title checks if a title is entered and then returns a movie title they've selected
    var movieName = movieTitle(movieTitleEl.value);
    movieTitleEl.value = ""; //<== Check to see if it clears value and doesn't mess with anything, also change search element

    //======== Release date function, verifies if date is 4 digits, and beyond 1887 (first movie made in 1888) otherwise loops back============
    var releaseDate = releaseInput(yearInputEl.value);
    yearInputEl.value = "";

    // sends all inputs to fetch/userSearch
    userSearch(movieName, releaseDate) //<========== CALL TO FETCH, COMMENTED FOR NOW
}






//================ FOURTH FUNCTION=========================//
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








//================ SECOND FUNCTION=========================//
//==================== function takes in search result for movie title and returns answer to "userSearchInformation, if user leaves blank then "any" is returned
//==================== this could also be an alert/modal if preferred.==================================//

var movieTitle = function (movieTitleInput) { //<====================== Ready

    if (movieTitleInput) {
        return movieTitleInput;
    } else if (movieTitleInput === "") {
        return "any"
        // alert("Please enter a movie title to search") //<=========================UPDATE and make a modal!
    }
}

//=================MOVIE MODAL CREATOR==============//

var movieModalCreator = function (event) {
    // find out which book was clicked and get corresponding book object from booksArray
    var clickedStart = event.currentTarget.id;
    var clickedIndex = clickedStart.split("-")[1];
    var clickedMovie = movieArray[clickedIndex];
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
    modalTitleEl.textContent = clickedMovie.title;
    var modalCloseEl = document.createElement("button");
    modalCloseEl.className = "delete";
    modalCloseEl.id = "modal-close";
    modalCloseEl.setAttribute("aria-label", "close");
    // modal card content
    var modalBodyEl = document.createElement("section");
    modalBodyEl.className = "modal-card-body";
    // modal image
    var modalimageEl = document.createElement("p");
    modalimageEl.className = "image mb-3 modal-image";
    var imageEl = document.createElement("img");
    if (!clickedMovie.poster_path) {
        imageEl.setAttribute("src", "./assets/images/not-available.jpg")
    } else {
        imageEl.setAttribute("src", "http://image.tmdb.org/t/p/original" + clickedMovie.poster_path);

    }
    // modal card book description
    var modalDescTitleEl = document.createElement("h1");
    modalDescTitleEl.className = "has-text-weight-bold mt-3";
    modalDescTitleEl.textContent = "Release Date: " + clickedMovie.release_date;
    var modalDescEl = document.createElement("p");
    modalDescEl.className = "pb-3";
    modalDescEl.textContent = clickedMovie.description;
    // modal card authors
    var modalAuthorsTitleEl = document.createElement("h1");
    modalAuthorsTitleEl.className = "has-text-weight-bold";
    modalAuthorsTitleEl.textContent = "Movie Description: ";
    var modalDescriptionEl = document.createElement("p");
    modalDescriptionEl.textContent = clickedMovie.overview;
    // append modal elements to DOM
    modalEl.appendChild(modalBackGroundEl);
    modalHeadEl.appendChild(modalTitleEl);
    modalHeadEl.appendChild(modalCloseEl);
    modalCardEl.appendChild(modalHeadEl);
    modalEl.appendChild(modalCardEl);
    modalBodyEl.appendChild(modalimageEl);
    modalimageEl.appendChild(imageEl);
    modalBodyEl.appendChild(modalDescTitleEl);
    modalBodyEl.appendChild(modalDescEl);
    modalBodyEl.appendChild(modalAuthorsTitleEl);
    modalBodyEl.appendChild(modalDescriptionEl);
    modalCardEl.appendChild(modalBodyEl);
    contentDisplayEl.appendChild(modalEl);

    // ================== Interest Button =================//
    let interestButtonEl = document.createElement('button');
    interestButtonEl.classList = 'button';
    interestButtonEl.setAttribute('type', 'movie');
    interestButtonEl.setAttribute('data-id', event.currentTarget.id);
    interestButtonEl.textContent = 'Add to interests'
    interestButtonEl.addEventListener('click', saveInterest)
    modalimageEl.appendChild(interestButtonEl)

    modalCloseEl.addEventListener("click", closeModal)
}





//====================BOOK SECTION==========================//

// function to fetch book data using user input as parameter
var bookFetchHandler = function (searchTerm) {
    console.log("book fetch");
    // initiate apiUrl variable
    var apiUrl;

    // book input value
    var userInput = bookInputEl.value

    // check if searching for title or author
    var bookSearchByEl = document.getElementById("book-search-by");
    if (bookSearchByEl.value === "title") {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            userInput +
            "&max-results=20&key=AIzaSyA2ONzDIFnpqYkH0ALMjMWuPbNh99zqNhw";
    } else {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            userInput +
            "+inauthor:" +
            userInput +
            "&max-results=20&key=AIzaSyA2ONzDIFnpqYkH0ALMjMWuPbNh99zqNhw";
    }
    // fetch data from api URL
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    // send data to function which will create object of
                    // relevent information
                    console.log(data);
                    bookInputEl.value = "";
                    bookObjectCreator(data);
                });
            } else {
                alert("Error: " + response.statusText);
            }
        })
        .catch(function (error) {
            alert("Unable to connect");
        });
};

var bookObjectCreator = function (data) {
    // clear books array from previous searches
    booksArray = [];
    console.log(data.items);
    // create array to hold book objects
    booksArray = []
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
        // push book object to booksArray
        booksArray.push(bookObject);
        console.log(booksArray);
    };
    // send bookObject to DOM element creator function
    displayContent(booksArray, 'book');
};

var bookModalCreator = function (event) {
    // find out which book was clicked and get corresponding book object from booksArray
    console.log(event.currentTarget.id);
    var clickedIndex = event.currentTarget.id.replace("index-", "");
    var clickedBook = booksArray[clickedIndex];
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
    modalTitleEl.textContent = clickedBook.title;
    var modalCloseEl = document.createElement("button");
    modalCloseEl.className = "delete";
    modalCloseEl.id = "modal-close";
    modalCloseEl.setAttribute("aria-label", "close");
    // modal card content
    var modalBodyEl = document.createElement("section");
    modalBodyEl.className = "modal-card-body";
    // modal image
    var modalimageEl = document.createElement("p");
    modalimageEl.className = "image mb-3 modal-image";
    var imageEl = document.createElement("img");
    imageEl.setAttribute("src", clickedBook.imageUrl);
    // modal card book description
    var modalDescTitleEl = document.createElement("h1");
    modalDescTitleEl.className = "has-text-weight-bold mt-3";
    modalDescTitleEl.textContent = "About the Book";
    var modalDescEl = document.createElement("p");
    modalDescEl.className = "pb-3";
    modalDescEl.textContent = clickedBook.description;
    // modal card authors
    var modalAuthorsTitleEl = document.createElement("h1");
    modalAuthorsTitleEl.className = "has-text-weight-bold";
    modalAuthorsTitleEl.textContent = "Author(s):";
    var modalAuthorsEl = document.createElement("p");
    console.log(clickedBook.authors);
    modalAuthorsEl.textContent = clickedBook.authors;
    // append modal elements to DOM
    modalEl.appendChild(modalBackGroundEl);
    modalHeadEl.appendChild(modalTitleEl);
    modalHeadEl.appendChild(modalCloseEl);
    modalCardEl.appendChild(modalHeadEl);
    modalEl.appendChild(modalCardEl);
    modalBodyEl.appendChild(modalimageEl);
    modalimageEl.appendChild(imageEl);
    modalBodyEl.appendChild(modalDescTitleEl);
    modalBodyEl.appendChild(modalDescEl);
    modalBodyEl.appendChild(modalAuthorsTitleEl);
    modalBodyEl.appendChild(modalAuthorsEl);
    modalCardEl.appendChild(modalBodyEl);
    contentDisplayEl.appendChild(modalEl);

    let interestButtonEl = document.createElement('button');
    interestButtonEl.classList = 'button';
    interestButtonEl.setAttribute('type', 'book');
    interestButtonEl.setAttribute('data-id', event.currentTarget.id)
    interestButtonEl.textContent = 'Add to interests'
    interestButtonEl.addEventListener('click', saveInterest)
    modalimageEl.appendChild(interestButtonEl)

    modalCloseEl.addEventListener("click", closeModal)
}
//===============END OF BOOK SECTION==========================//

let interestToggleEl = document.getElementById('toggle-interest-panel')
interestToggleEl.addEventListener('click', function () {
    var interestPanelEl = document.getElementById('interest-panel')
    if (interestPanelEl.className === 'is-hidden') {
        interestPanelEl.classList = 'panel'
    } else {
        interestPanelEl.classList = 'is-hidden'
    }
})

const panelTabHandler = function (event) {
    switch (event.target.id) {
        case "movie-tab":
            document.getElementById('movie-tab').setAttribute('class', 'is-active');
            document.getElementById('book-tab').removeAttribute('class');
            // document.getElementById('music-tab').removeAttribute('class');
            moviePanelEl.removeAttribute('class');
            bookPanelEl.setAttribute('class', 'is-hidden');
            // musicPanelEl.setAttribute('class', 'is-hidden');
            break;
        /* case "music-tab":
            document.getElementById('music-tab').setAttribute('class', 'is-active');
            document.getElementById('movie-tab').removeAttribute('class');
            document.getElementById('book-tab').removeAttribute('class');
            musicPanelEl.removeAttribute('class');
            moviePanelEl.setAttribute('class', 'is-hidden');
            bookPanelEl.setAttribute('class', 'is-hidden');
            break; */
        case "book-tab":
            document.getElementById('book-tab').setAttribute('class', 'is-active');
            document.getElementById('movie-tab').removeAttribute('class');
            // document.getElementById('music-tab').removeAttribute('class');
            bookPanelEl.removeAttribute('class');
            moviePanelEl.setAttribute('class', 'is-hidden');
            // musicPanelEl.setAttribute('class', 'is-hidden');
            break;
    }
}

const createDeleteButton = function (itemEl, array, type) {
    deleteContainerEl = document.createElement('div');
    deleteContainerEl.className = 'ml-2';
    itemEl.appendChild(deleteContainerEl);
    deleteButtonEl = document.createElement('button');
    deleteButtonEl.className = 'delete';
    deleteContainerEl.appendChild(deleteButtonEl);

    deleteContainerEl.addEventListener('click', function (event) {
        for (let i = 0; i < array.length; i++) {
            if (array[i].title === itemEl.textContent) {
                array.splice(i, 1)
                localStorage.setItem(`m4u-saved${type}`, JSON.stringify(array))
                itemEl.remove();
            }
        }
    })
}

// function to close modals when close button is clicked
var closeModal = function (event) {
    var modalEl = event.target.closest(".is-active");
    modalEl.classList.remove("is-active");
}

const saveInterest = function (event) {
    let targetEl = event.target

    let targetType = targetEl.getAttribute("type")
    let targetId = targetEl.getAttribute("data-id")
    targetId = targetId.split("-")
    targetId = targetId[1]

    let interestEl;
    switch (targetType) {
        case 'movie':
            savedMovies = JSON.parse(localStorage.getItem("m4u-savedMovies")) || []
            interestEl = movieArray[targetId]
            savedMovies.push(interestEl)
            localStorage.setItem("m4u-savedMovies", JSON.stringify(savedMovies))
            break;
        case 'book':
            savedBooks = JSON.parse(localStorage.getItem("m4u-savedBooks")) || []
            interestEl = booksArray[targetId]
            savedBooks.push(interestEl)
            localStorage.setItem("m4u-savedBooks", JSON.stringify(savedBooks))
            break;
        /* case 'music':
            savedMusic = JSON.parse(localStorage.getItem("m4u-savedMusic")) || []
            interestEl = musicArray[targetId]
            savedMusic.push(interestEl)
            localStorage.setItem("m4u-savedMusic", JSON.stringify(savedMusic))
            break; */
        default:
        // error handling
    }

    updateInterestSection()
}

const updateInterestSection = function () {

    moviePanelEl.textContent = ''
    let savedMovies = JSON.parse(localStorage.getItem('m4u-savedMovies')) || []
    for (let i = 0; i < savedMovies.length; i++) {
        let itemEl = document.createElement('div');
        itemEl.classList = 'panel-block container has-text-weight-semibold panel-list-item'
        itemEl.textContent = savedMovies[i].title
        moviePanelEl.appendChild(itemEl)
        createDeleteButton(itemEl, savedMovies, "Movies");
    }

    bookPanelEl.textContent = ''
    let savedBooks = JSON.parse(localStorage.getItem('m4u-savedBooks')) || []
    for (let i = 0; i < savedBooks.length; i++) {
        let itemEl = document.createElement('div');
        itemEl.classList = 'panel-block container has-text-weight-semibold panel-list-item'
        itemEl.textContent = savedBooks[i].title
        bookPanelEl.appendChild(itemEl)
        createDeleteButton(itemEl, savedBooks, "Books");
    }

    /* musicPanelEl.textContent = ''
    let savedMusic = JSON.parse(localStorage.getItem('m4u-savedMusic')) || []
    for (let i = 0; i < savedMusic.length; i++) {
        let itemEl = document.createElement('div');
        itemEl.classList = 'panel-block container has-text-weight-semibold panel-list-item'
        itemEl.textContent = savedMusic[i].title;
        musicPanelEl.appendChild(itemEl);
        createDeleteButton(itemEl, savedMusic, "Music");
    }*/
}

const bookInputHandler = function () {

    if (bookSearchByEl.value === 'Keyword') {
        bookInputLabelEl.textContent = 'Keyword'
    } else {
        bookInputLabelEl.textContent = 'Author'
    }
}

// saveInterestBtn.addEventListener('click', saveInterest);
// attach saveInterestBtn and event listener to modals
// indexEl.addEventListener("click", clickChecker);
bookSearchByEl.addEventListener('change', bookInputHandler)
panelTabsEl.addEventListener('click', panelTabHandler);
mediaSelectEl.addEventListener("change", mediaSelectHandler);
searchFormEl.addEventListener("submit", formHandler);

updateInterestSection();

const getBookImage = function (array, imageEl) {
    var imageSrc = array[i].imageUrl;
    imageEl.setAttribute("src", imageSrc);
}

const getMovieImage = function (imageEl, array, imgWrapperEl) {
    poster = array[i].poster_path
    if (!poster) {
        // set source of img element
        imageEl.setAttribute("src", "./assets/images/not-available.jpg");
        var movieTitle = array[i].title;
        var titleOverlayEl = document.createElement('div');
        titleOverlayEl.className = 'title-overlay';
        titleOverlayEl.textContent = movieTitle;
        imgWrapperEl.appendChild(titleOverlayEl);
    }
    else {
        // set source of img element
        var imageSrc = "http://image.tmdb.org/t/p/original" + array[i].poster_path;
        imageEl.setAttribute("src", imageSrc);
    }
}