var mediaSelectEl = document.getElementById("media-select");

var movieTitleEl = document.getElementById("movie-title");
var searchGenreEl = document.getElementById("search-by-genre");
var yearInputEl = document.getElementById("search-by-year");
var closeEl = document.getElementsByClassName("modal-close")

var bookSearchByEl = document.getElementById("book-search-by");
var bookInputEl = document.getElementById("book-input")

var submitButtonEl = document.getElementById("submit-button");



// funtion to check which media types are selected
// then send input to correct fetch function
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
var genreCheck = function(genreInfo) {
    var genreInput = searchGenreEl.value
    console.log(searchGenreEl.value)
    var resultLength = genreInfo.results.length;
    var resultId = genreInfo.results;
    var anyChosen = searchGenreEl[0].value
    movieArray = [];

    for (var i = 0; i < resultLength; i++) {
        var resultArray = resultId[i].genre_ids
        if (resultArray.includes(parseInt(genreInput))) {
            movieArray.push(resultId[i])
        } else if (anyChosen === "Any") {
            movieArray.push(resultId[i])
        } else {
            console.log("Nothing Returned") //<============================ MODAL NEEDED
         return
    }
}
finalResultStyle(movieArray)
}







//================ Results added to DOM in order to display===============//
var finalResultStyle = function(results) {
    var movieContainerEl = document.getElementById("movie-container");
       var movieMainEl = document.getElementById("movie-info-0");

    if (results.resultLength=== 0) {
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
    } else {
        moviePosterEl.setAttribute("src", "./assets/images/not-available.jpg")
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
    userSearch(movieName, releaseDate)    //<========== CALL TO FETCH, COMMENTED FOR NOW
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

//====================BOOK SECTION==========================//

// function to fetch book data using user input as parameter
var bookFetchHandler = function () {
    // initiate apiUrl variable
    var apiUrl;

    // book input value
    userInput = bookInputEl.value

    // check if searching for title or author
    if (bookSearchByEl.value === "title") {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
     userInput;
    } else {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            userInput +
            "+inauthor:" + userInput;

    }
    // fetch data from api URL
    fetch(apiUrl)
        .then(function (response) {
            // request was successful
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data);
                    // send data to function which will create object of
                    // relevent information
                    // bookObjectCreator(data);
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

var closeModal = function () {
    console.log("button clicked")
}



submitButtonEl.addEventListener("click", formHandler);
mediaSelectEl.addEventListener("change", mediaSelectHandler);

