// NEED TO ADD INPUTS INTO FETCH

var userSearch = function (title, releaseYear, genreId) {
    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=aafd4b8dcf6c14437ba0157bc3e6e116&language=en-US&query=" + title + "&include_adult=false&primary_release_year=" + releaseYear
var mediaSelectEl = document.getElementById("media-select");
var searchInputEl = document.getElementById("search-input");
var searchByEl = document.getElementById("search-by");
var submitButtonEl = document.getElementById("submit-button");

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
        console.log("sent to movies");
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

// BOOKS SECTION
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

submitButtonEl.addEventListener("click", formHandler);

// MOVIE SECTION
//============= Don't forget to add query locators in order to grab answers below



// NEED TO ADD INPUTS INTO FETCH

var userSearch = function (title, adult, releaseYear, genreId) {
    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=aafd4b8dcf6c14437ba0157bc3e6e116&language=en-US&query=" +
    title +
    "&include_adult=" +
    adult +
    "&primary_release_year=" +
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
    var resultLength = genreInfo.results.length
    var resultId = genreInfo.results

    for (var i = 0; i < resultLength; i++) {
        var resultArray = resultId[i].genre_ids
        if (resultArray.includes(genreInput)) {
        console.log(resultId[i])
        } else {
            return
    }
}
}





//============= User choice for genre sends user here where it will return a number(id) and send it to genreCheck to then verify if movies have that criteria
var genreConversion = function(userInput) {
    var genreList = {
        "Action": 28,
        "Adventure": 12,
        "Animation": 16,
        "Comedy": 35,
        "Crime": 80,
        "Documentary": 99,
        "Drama": 18,
        "Family": 10751,
        "Fantasy": 14,
        "History": 36,
        "Horror": 27,
        "Music": 10402,
        "Mystery": 9648,
        "Romance": 10749,
        "Thriller": 53,
        "War": 10752,
        "Western": 37
    };
    return (genreList[userInput]) //<========returns number(id) that will be used in genreCheck to verify if the movies fetched have that genre ID
    }





    







//============ MAIN search function that calls everything else for MOVIE TITLES! ==============================//
//============= Function that takes all search criteria and will compound it =================================//
//============ together and send to the "userSearch"/fetch request============================================//
var userSearchInformation = function (title) {


    //======= Movie title checks if a title is entered and then returns a movie title they've selected
    var movieName = movieTitle(title);
    console.log(movieName)
    searchInputEl.value = ""; //<== Check to see if it clears value and doesn't mess with anything, also change search element



    //===== Include adult checks if someone wants adult films included in search, if they don't enter anything it will default to NO====
    var includeAdult = adultChoice();
    // something = ""; ==== set this to whatever the default value is, if drop down make it so it gets set back to blank or please select option




    //======== Release date function, verifies if date is 4 digits, and beyond 1887 (first movie made in 1888) otherwise loops back============
    var releaseDate = releaseInput(); 
    // something == "" //<=========================clear field after they search

    var genreId = genreConversion(); //<============= Drop down box with all the typical options for genre


    // sends all inputs to fetch/userSearch
    userSearch(movieName, includeAdult, releaseDate, genreId)    //<========== CALL TO FETCH, COMMENTED FOR NOW
}






//================ FOURTH FUNCTION=========================//
// function checks to make sure year is 4 digits long, and is beyond 1887 (first movie 1888) and returns a year/integer
var releaseInput = function() {
    var dateInput = "2006"; //<========Change to grab from HTML/Search Box
    var dateInputConverted = parseInt(dateInput);    
    var dateInputCombined = dateInputConverted.toString();
    var currentYear = moment().year();
    
    if (dateInputCombined.length === 4 && dateInputConverted > 1887 && dateInputConverted <= currentYear) { // <====== first movie made in 1888, no need to search before then. Also verified after being parsed that the length is 4
        return dateInputConverted
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









//================ THIRD FUNCTION=========================//
//================ function will check the drop down value and return whether the user selected true or false================//
//=============== ask group if they would like to have this default to NO and not be asked, but function is ready============//
var adultChoice = function() {
    var adultSearchResult = ""; // CHANGE ELEMENT TO GRAB FROM HTML/DOM //<======== This will need to be updated to the drop down box EX searchEl.value
    var finalRes = adultSearchResult.toLowerCase(); //<==== In case there is ever typing toLowerCase will make it lower case to ensure it matches the if statement

    if (finalRes === "yes") {
        return "true";
    } else if (finalRes === "no") {
        return "false";
    } else {
        return "false"; //<================= Default value is going to be No/False for safety
    }
}




// userSearch(name, region, year, releaseYear);
var mediaSelectEl = document.getElementById("media-select");
var searchInputEl = document.getElementById("search-input");
var searchByEl = document.getElementById("search-by");
var submitButtonEl = document.getElementById("submit-button");


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
        userSearchInformation(searchTerm);
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

mediaSelectEl.addEventListener("change", mediaSelectHandler);
submitButtonEl.addEventListener("click", formHandler);
