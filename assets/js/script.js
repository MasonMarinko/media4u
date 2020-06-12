//============= Don't forget to add query locators in order to grab answers below



// NEED TO ADD INPUTS INTO FETCH

var userSearch = function (title, adult, releaseYear, genreId) {
    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=aafd4b8dcf6c14437ba0157bc3e6e116&language=en-US&query=" + title + "&include_adult=" + adult + "&primary_release_year=" + releaseYear
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
    return (genreList[userInput])
    }





    







//============ MAIN search function that calls everything else for MOVIE TITLES! ==============================//
//============= Function that takes all search criteria and will compound it =================================//
//============ together and send to the "userSearch"/fetch request============================================//
var userSearchInformation = function () {
    


    //======= Movie title checks if a title is entered and then returns a movie title they've selected
    var movieName = movieTitle();
    // searchEl.value = ""; //<== Check to see if it clears value and doesn't mess with anything, also change search element



    //===== Include adult checks if someone wants adult films included in search, if they don't enter anything it will default to NO====
    var includeAdult = adultChoice();
    // something = ""; ==== set this to whatever the default value is, if drop down make it so it gets set back to blank or please select option




    //======== Release date function, verifies if date is 4 digits, and beyond 1887 (first movie made in 1888) otherwise loops back============
    var releaseDate = releaseInput(); 
    // something == "" //<=========================clear field after they search

    var genreId = genreConversion("Adventure"); //<============= Drop down box with all the typical options for genre


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
    
    var nameSearchResult = "Avengers";//===== searchEl.value;  //<======================= update to search box once done!

    if (nameSearchResult) {
        return nameSearchResult;
    } else if (nameSearchResult === "") {
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







userSearchInformation();
movieTitle("Avengers");
// userSearch(name, region, year, releaseYear);