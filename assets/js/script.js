// general elements
var mediaSelectEl = document.getElementById("media-select");
var searchFormEl = document.getElementById("search-form");
var submitButtonEl = document.getElementById("submit-button");
var closeEl = document.getElementsByClassName("modal-close");
var panelTabsEl = document.getElementById('panel-tabs')
var moviePanelEl = document.getElementById('movie-panel')
var musicPanelEl = document.getElementById('music-panel')
var bookPanelEl = document.getElementById('book-panel')
// content section elements
var contentDisplayEl = document.getElementById("content-display");
var contentTitleEl = document.getElementById("content-title");
var postersWrapperEl = document.getElementById("posters-wrapper");
// movie elements
var movieTitleEl = document.getElementById("movie-title");
var searchGenreEl = document.getElementById("search-by-genre");
var yearInputEl = document.getElementById("search-by-year");
// book elements
var bookSearchInputEl = document.getElementById("book-input");
var bookSearchByEl = document.getElementById("book-search-by");
var bookInputEl = document.getElementById("book-input")
// arrays
var booksArray = [];
var movieArray = [];
var musicArray = [];
var savedMovies = [];
var savedMusic = [];
var savedBooks = [];




// function to check which media types are selected
// then send input to correct fetch functions
var formHandler = function (event) {
    event.preventDefault();

    var selectedMedia = mediaSelectEl.value;

    // send user input to appropriate fetch function
    if (selectedMedia === "movies") {

        movieSearchHandler();

    } else if (selectedMedia === "music") {
        console.log("sent to music");
        // send userInput to music fetch function
        // musicFetchHandler(userInput);
    } else if (selectedMedia === "books") {
        console.log("sent to books");
        bookFetchHandler();
    }
};

const mediaSelectHandler = function () {
    switch (mediaSelectEl.value) {
        case "movies":
            document.getElementById('movie-form').setAttribute('class', 'field');
            document.getElementById('music-form').setAttribute('class', 'is-hidden');
            document.getElementById('book-form').setAttribute('class', 'is-hidden');
            break;
        case "music":
            document.getElementById('movie-form').setAttribute('class', 'is-hidden');
            document.getElementById('music-form').setAttribute('class', 'field');
            document.getElementById('book-form').setAttribute('class', 'is-hidden');
            break;
        case "books":
            document.getElementById('movie-form').setAttribute('class', 'is-hidden');
            document.getElementById('music-form').setAttribute('class', 'is-hidden');
            document.getElementById('book-form').setAttribute('class', 'field');
            break;
    }
}

// MOVIE SECTION
//============= Don't forget to add query locators in order to grab answers below



// NEED TO ADD INPUTS INTO FETCH

var userSearch = function (title, releaseYear) {
    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=aafd4b8dcf6c14437ba0157bc3e6e116&language=en-US&query=" +
        title +
        "&include_adult=false&primary_release_year=" +
        releaseYear;

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
};








//====== Function takes in data from fetch, and number(id) from genreConversion which will verify if movies that have been fetched match those genre ID's, if they do they are returned, if not they will no longer show.
var genreCheck = function (genreInfo) {
    var genreInput = searchGenreEl.value
    var resultLength = genreInfo.results.length;
    var resultId = genreInfo.results;
    movieArray = [];

    for (var i = 0; i < resultLength; i++) {
        var resultArray = resultId[i].genre_ids
        if (resultArray.includes(parseInt(genreInput))) {
            movieArray.push(resultId[i])
        } else if (genreInput === "any") {
            movieArray.push(resultId[i])
        } else {
            console.log("Nothing Returned") //<============================ MODAL NEEDED
            return
        }
    }
    console.log(movieArray)
    finalResultStyle(movieArray)
}







//================ Results added to DOM in order to display===============//
var finalResultStyle = function (results) {
    var movieContainerEl = document.getElementById("movie-container");
    var movieMainEl = document.getElementById("movie-info-0");
    movieMainEl.textContent = ""

    if (results.resultLength === 0) {
        movieContainerEl.textContent = "No Movies Found"
        return;
    }


    for (var i = 0; i < results.length; i++) {

        //========BEGINNING FIRST CHUNK================//
        var posterContainerEl = document.createElement("div");
        posterContainerEl.classList = "media"

        var posterContainerTwoEl = document.createElement("div");
        posterContainerTwoEl.classList = "media-left"

        var figureEl = document.createElement("figure");
        figureEl.classList = "image is-48x48"

        var moviePosterEl = document.createElement("img");
        if (results[i].poster_path) {
            moviePosterEl.setAttribute("src", "http://image.tmdb.org/t/p/original" + results[i].poster_path)
        } else if (results[i].backdrop_path) {
            moviePosterEl.setAttribute("src", "http://image.tmdb.org/t/p/original" + results[i].backdrop_path)
        } else {
            moviePosterEl.setAttribute("src", "./assets/images/image-unavailable.jpg")

        }

        movieMainEl.appendChild(posterContainerEl)

        posterContainerEl.appendChild(posterContainerTwoEl)

        posterContainerTwoEl.appendChild(figureEl)

        figureEl.appendChild(moviePosterEl)
        //==============END FIRST CHUNK===============//

        //============= Beginning Second Chunk=============//
        var titleContainerEl = document.createElement("div");
        titleContainerEl.classList = "media-content"

        var movieTitleEl = document.createElement("p");
        movieTitleEl.classList = "title is-4"
        movieTitleEl.setAttribute("id", "main-movie-title")
        movieTitleEl.textContent = results[i].original_title;

        movieMainEl.appendChild(titleContainerEl)

        titleContainerEl.appendChild(movieTitleEl)
        //================End second chunk===============//

        //================= Beginning Final Chunk================//
        var descContainerEl = document.createElement("div");
        descContainerEl.classList = "content"
        descContainerEl.setAttribute = "movie-description"
        descContainerEl.textContent = results[i].overview

        movieMainEl.appendChild(descContainerEl)
    }

}






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

var closeModal = function () {
    console.log("button clicked")
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
    bookContentCreator(booksArray);
};

var bookContentCreator = function (booksArray) {
    contentDisplayEl.classList.remove("is-hidden");
    contentTitleEl.textContent = "Books";
    postersWrapperEl.innerHTML = "";
    for (i = 0; i < booksArray.length; i++) {
        // create book element to go inside postersWrapper
        var singlePosterEl = document.createElement("div");
        // give book element an id referencing its index in booksArray
        var indexId = "index-" + i;
        singlePosterEl.setAttribute("id", indexId);
        // set styling for book div
        singlePosterEl.className = ("column is-one-fifth-desktop is-one-third-tablet is-half-mobile");
        // create div to hold img
        var bookImgWrapperEl = document.createElement("div");
        // give div class name image
        bookImgWrapperEl.className = "image pointer";
        // create img element
        var bookImageEl = document.createElement("img");
        // set source of img element
        var imageSrc = booksArray[i].imageUrl;
        bookImageEl.setAttribute("src", imageSrc);
        // append elements
        bookImgWrapperEl.appendChild(bookImageEl);
        singlePosterEl.appendChild(bookImgWrapperEl);
        // append book poster to postersWrapper to be displayed
        postersWrapperEl.appendChild(singlePosterEl);

        // add to interest button
        let interestButtonEl = document.createElement('button');
        interestButtonEl.classList = 'button';
        interestButtonEl.setAttribute('type', 'book');
        interestButtonEl.setAttribute('data-id', indexId);
        interestButtonEl.textContent = 'Add to interests'
        interestButtonEl.addEventListener('click', saveInterest)
        singlePosterEl.appendChild(interestButtonEl)
    }
};

let interestToggleEl = document.getElementById('toggle-interest-panel')
interestToggleEl.addEventListener('click', function () {
    var interestPanelEl = document.getElementById('interest-panel')
    if (interestPanelEl.className === 'is-hidden') {
        interestPanelEl.classList = 'panel'
        window.scrollTo(0, 0)
    } else {
        interestPanelEl.classList = 'is-hidden'
    }
})

const panelTabHandler = function (event) {
    switch (event.target.id) {
        case "movie-tab":
            document.getElementById('movie-tab').setAttribute('class', 'is-active');
            document.getElementById('music-tab').removeAttribute('class');
            document.getElementById('book-tab').removeAttribute('class');
            moviePanelEl.removeAttribute('class');
            musicPanelEl.setAttribute('class', 'is-hidden');
            bookPanelEl.setAttribute('class', 'is-hidden');
            break;
        case "music-tab":
            document.getElementById('music-tab').setAttribute('class', 'is-active');
            document.getElementById('movie-tab').removeAttribute('class');
            document.getElementById('book-tab').removeAttribute('class');
            musicPanelEl.removeAttribute('class');
            moviePanelEl.setAttribute('class', 'is-hidden');
            bookPanelEl.setAttribute('class', 'is-hidden');
            break;
        case "book-tab":
            document.getElementById('book-tab').setAttribute('class', 'is-active');
            document.getElementById('movie-tab').removeAttribute('class');
            document.getElementById('music-tab').removeAttribute('class');
            bookPanelEl.removeAttribute('class');
            moviePanelEl.setAttribute('class', 'is-hidden');
            musicPanelEl.setAttribute('class', 'is-hidden');
            break;
    }
}

// Save Interest Feature
// event listener target needs an id (for event listener),
// a type (movie, book, or music)
// and a data-id (for getting the item from the array),
// and will be attatched to the display modals


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
        case 'music':
            savedMusic = JSON.parse(localStorage.getItem("m4u-savedMusic")) || []
            interestEl = musicArray[targetId]
            savedMusic.push(interestEl)
            localStorage.setItem("m4u-savedMusic", JSON.stringify(savedMusic))
            break;
        case 'book':
            savedBooks = JSON.parse(localStorage.getItem("m4u-savedBooks")) || []
            interestEl = booksArray[targetId]
            savedBooks.push(interestEl)
            localStorage.setItem("m4u-savedBooks", JSON.stringify(savedBooks))
            break;
        default:
        // error handling
    }

    updateInterestSection()
}

const createDeleteButton = function(itemEl, array, type) {
    deleteContainerEl = document.createElement('div');
    deleteContainerEl.className = 'ml-2';
    itemEl.appendChild(deleteContainerEl);
    deleteButtonEl = document.createElement('button');
    deleteButtonEl.className = 'delete';
    deleteContainerEl.appendChild(deleteButtonEl);

    deleteContainerEl.addEventListener('click', function (event) {
        debugger;
        for (let i = 0; i < array.length; i++) {
            if (array[i].title === itemEl.textContent) {
                array.splice(i, 1)
                localStorage.setItem(`m4u-saved${type}`, JSON.stringify(array))
                itemEl.remove();
            }
        }
    })
}

const updateInterestSection = function () {

    moviePanelEl.textContent = ''
    let movieArray = JSON.parse(localStorage.getItem('m4u-savedMovies')) || []
    for (let i = 0; i < movieArray.length; i++) {
        let itemEl = document.createElement('div');
        itemEl.classList = 'panel-block container has-text-weight-semibold panel-list-item'
        itemEl.textContent = movieArray[i].title
        moviePanelEl.appendChild(itemEl)
        createDeleteButton(itemEl, movieArray, "Movies");
    }

    musicPanelEl.textContent = ''
    let musicArray = JSON.parse(localStorage.getItem('m4u-savedMusic')) || []
    for (let i = 0; i < musicArray.length; i++) {
        let itemEl = document.createElement('div');
        itemEl.classList = 'panel-block container has-text-weight-semibold panel-list-item'
        itemEl.textContent = musicArray[i].title;
        musicPanelEl.appendChild(itemEl);
        createDeleteButton(itemEl, musicArray, "Music");
    }

    bookPanelEl.textContent = ''
    let bookArray = JSON.parse(localStorage.getItem('m4u-savedBooks')) || []
    for (let i = 0; i < bookArray.length; i++) {
        let itemEl = document.createElement('div');
        itemEl.classList = 'panel-block container has-text-weight-semibold panel-list-item'
        itemEl.textContent = bookArray[i].title
        bookPanelEl.appendChild(itemEl)
        createDeleteButton(itemEl, bookArray, "Books");
    }
}

// saveInterestBtn.addEventListener('click', saveInterest);
// attach saveInterestBtn and event listener to modals

panelTabsEl.addEventListener('click', panelTabHandler)
mediaSelectEl.addEventListener("change", mediaSelectHandler);
searchFormEl.addEventListener("submit", formHandler);

updateInterestSection();

