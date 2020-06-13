// userSearch(name, region, year, releaseYear);
var mediaSelectEl = document.getElementById("media-select");
var searchInputEl = document.getElementById("search-input");
var searchByEl = document.getElementById("search-by");
var searchGenreEl = document.getElementsByClassName("search-by-genre");
var submitButtonEl = document.getElementById("submit-button");
var yearInputEl = document.getElementById("search-by-year");



// funtion to check which media types are selected
// then send input to correct fetch function
var formHandler = function (event) {
    event.preventDefault();
    // define user input from form
    var searchTerm = searchInputEl.value;
    // define type of media user selected
    var selectedMedia = mediaSelectEl.value;
    // send user input to appropriate fetch function
    if (selectedMedia === "movies") {
        var yearInput = yearInputEl.value
        var genreIdNum = searchGenreEl[0].value
        userSearchInformation(searchTerm, yearInput, genreIdNum);
        // send searchTerm to Mason's movie fetch function
        // movieFetchHandler(searchTerm);
    } else if (selectedMedia === "music") {
        console.log("sent to music");
        // send searchTerm to music fetch function
        // musicFetchHandler(searchTerm);
    } else if (selectedMedia === "books") {
        console.log("sent to books");
        // send searchTerm to book fetch function
        bookFetchHandler(searchTerm);
    }
};

const mediaSelectHandler = function () {
    switch (mediaSelectEl.value) {
        case "movies":
        document.getElementById('movie-form').removeAttribute('class', 'is-hidden');
        document.getElementById('music-form').setAttribute('class', 'is-hidden');
        document.getElementById('book-form').setAttribute('class', 'is-hidden');
        break;
        case "music":
        document.getElementById('movie-form').setAttribute('class', 'is-hidden');
        document.getElementById('music-form').removeAttribute('class', 'is-hidden');
        document.getElementById('book-form').setAttribute('class', 'is-hidden');
        break;
        case "books":
        document.getElementById('movie-form').setAttribute('class', 'is-hidden');
        document.getElementById('music-form').setAttribute('class', 'is-hidden');
        document.getElementById('book-form').removeAttribute('class', 'is-hidden');
        break;
    }
}

// MOVIE SECTION
//============= Don't forget to add query locators in order to grab answers below

// NEED TO ADD INPUTS INTO FETCH

var userSearch = function (title, releaseYear, genreId) {
    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=aafd4b8dcf6c14437ba0157bc3e6e116&language=en-US&query=" +
    title +
    "&include_adult=false&primary_release_year=" +
    releaseYear;

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    genreCheck(data, genreId)
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
var genreCheck = function(genreInfo, genreInput) {
    var resultLength = genreInfo.results.length;
    var resultId = genreInfo.results;

    for (var i = 0; i < resultLength; i++) {
        var resultArray = resultId[i].genre_ids
        if (resultArray.includes(parseInt(genreInput))) {
        console.log(resultId[i])
        } else {
            return
    }
}
}

//============ MAIN search function that calls everything else for MOVIE TITLES! ==============================//
//============= Function that takes all search criteria and will compound it =================================//
//============ together and send to the "userSearch"/fetch request============================================//
var userSearchInformation = function (title, year, genre) {


    //======= Movie title checks if a title is entered and then returns a movie title they've selected
    var movieName = movieTitle(title);
    searchInputEl.value = ""; //<== Check to see if it clears value and doesn't mess with anything, also change search element



    //======== Release date function, verifies if date is 4 digits, and beyond 1887 (first movie made in 1888) otherwise loops back============
    var releaseDate = releaseInput(year);
    yearInputEl.value = "";
    searchGenreEl.value = "";


    // sends all inputs to fetch/userSearch
    userSearch(movieName, releaseDate, genre)    //<========== CALL TO FETCH, COMMENTED FOR NOW
}

//================ FOURTH FUNCTION=========================//
// function checks to make sure year is 4 digits long, and is beyond 1887 (first movie 1888) and returns a year/integer
var releaseInput = function(yearInput) {
    var dateInput = parseInt(yearInput); //<========Change to grab from HTML/Search Box
    var dateInputCombined = dateInput.toString();
    var currentYear = moment().year();

    if (dateInputCombined.length === 4 && dateInput > 1887 && dateInput <= currentYear) { // <====== first movie made in 1888, no need to search before then. Also verified after being parsed that the length is 4
        return dateInput
    }  else {
        var dateInput = ""
        return "any"
    }
}

//================ SECOND FUNCTION=========================//
//==================== function takes in search result for movie title and returns answer to "userSearchInformation, if user leaves blank then "any" is returned
//==================== this could also be an alert/modal if preferred.==================================//

var movieTitle = function(movieTitleInput) { //<====================== Ready

    if (movieTitleInput) {
        return movieTitleInput;
    } else if (movieTitleInput === "") {
        return "any"
        // alert("Please enter a movie title to search") //<=========================UPDATE and make a modal!
    }
}

// ********************************************************************************************************************************
// BOOK MEDIA SECTION

// function to fetch book data using user input as parameter
var bookFetchHandler = function (searchTerm) {
    // initiate apiUrl variable
    var apiUrl;
    // check if searching for title or author
    if (searchByEl.value === "title") {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            searchTerm;
    } else {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            searchTerm +
            "+inauthor:" + searchTerm;
    }
    // fetch data from api URL
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    // send data to function which will create object of
                    // relevent information
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
    // use a random number to select index of returned data to ensure
    // new books are discovered upon each search
    var randomNumber = Math.floor(Math.random() * data.items.length);
    // get title information
    var title = data.items[randomNumber].volumeInfo.title;
    // get image url
    var imageUrl = data.items[randomNumber].volumeInfo.imageLinks.thumbnail;
    // get description
    var description = data.items[randomNumber].volumeInfo.description;
    if (!description) {
        description = "Description is unavailable for this content.";
    };
    // define "authors" location in data
    var authorsArray = data.items[randomNumber].volumeInfo.authors;
    // create book object
    var bookObject = {
        title: title,
        imageUrl: imageUrl,
        description: description,
        authors: authorsArray
    }
    console.log(bookObject);
    // send bookObject to DOM element creator function
    // bookContentCreator(bookObject);
};

mediaSelectEl.addEventListener("change", mediaSelectHandler);
submitButtonEl.addEventListener("submit", formHandler);

