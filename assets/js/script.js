// NEED TO ADD INPUTS INTO FETCH
// userSearch(name, region, year, releaseYear);
var mediaSelectEl = document.getElementById("media-select");
var searchInputEl = document.getElementById("search-input");
var searchByEl = document.getElementById("search-by");
var searchGenreEl = document.getElementsByClassName("search-by-genre");
var submitButtonEl = document.getElementById("submit-button");
var yearInputEl = document.getElementById("search-by-year");
var closeEl = document.getElementsByClassName("modal-close")

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
    console.log(genreInfo)
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
    console.log(results.length)
    var movieContainerEl = document.getElementById("movie-container");
       var movieMainEl = document.getElementById("movie-info-0");

    if (results.resultLength=== 0) {
        movieContainerEl.textContent = "No Movies Found"
        return;
    }





//========BEGINNING FIRST CHUNK================//
    var posterContainerEl = document.createElement("div");
    posterContainerEl.classList = "media"

    var posterContainerTwoEl = document.createElement("div");
    posterContainerTwoEl.classList = "media-left"

    var figureEl = document.createElement("figure");
    figureEl.classList = "image is-48x48"

    var moviePosterEl = document.createElement("img");
    moviePosterEl.setAttribute("src", "http://image.tmdb.org/t/p/original/ygCQnDEqUEIamBpdQdDYnFfxvgM.jpg")


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
    movieTitleEl.textContent = "Testing, is this working??"

    movieMainEl.appendChild(titleContainerEl)

    titleContainerEl.appendChild(movieTitleEl)
//================End second chunk===============//

//================= Beginning Final Chunk================//
    var descContainerEl = document.createElement("div");
    descContainerEl.classList = "content"
    descContainerEl.setAttribute = "movie-description"
    descContainerEl.textContent = "Yes this is the description of the movie, let's see how long this will work for!"

    movieMainEl.appendChild(descContainerEl)





    // var moviePosterEl = document.getElementById("movie-poster");
    // var movieDescriptionEl = document.getElementById("movie-description");

    
    // movieMainEl.textContent = results[0].original_title;
    // moviePosterEl.textContent = "https://image.tmdb.org/t/p/w500/kHQ81KIAq8kD9NfUmHjTgAahoCW.jpg";
    // movieDescriptionEl.textContent = results[0].overview;

// var submitButtonEl = document.getElementById("submit-button");
// var yearInputEl = document.getElementById("search-by-year");
// var closeEl = document.getElementsByClassName("modal-close")
// todayTempEl.textContent = currentTemp + " \xB0 F";
// todayHumidEl.textContent = currentHum + "%";
// todayWindEl.textContent = currentWind + " MPH";
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

// function to fetch book data using user input as parameter
var bookFetchHandler = function (searchTerm) {
    // initiate apiUrl variable
    var apiUrl;
    // check if searching for title or author
    if (searchByEl.value === "title") {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            searchTerm;
        console.log(apiUrl);
    } else {
        var apiUrl = "https://www.googleapis.com/books/v1/volumes?q=" +
            searchTerm +
            "+inauthor:" + searchTerm;
        console.log(apiUrl);
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

var mediaSelectHandler = function () {
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

var closeModal = function () {
    console.log("button clicked")
}



mediaSelectEl.addEventListener("change", mediaSelectHandler);
submitButtonEl.addEventListener("click", formHandler);
