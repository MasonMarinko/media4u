//============= Don't forget to add query locators in order to grab answers below


// NEED TO ADD INPUTS INTO FETCH

var userSearch = function (title, adult, releaseYear) {
    var apiUrl = "https://api.themoviedb.org/3/search/movie?api_key=aafd4b8dcf6c14437ba0157bc3e6e116&language=en-US&query=Avengers&include_adult=false&region=TEST&year=TEST&primary_release_year=TEST"
    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    console.log(data)
                });
            } else {
                alert("Error: " + response.statusText + '. ' + 'Please make sure the format is City, State');
            }
        })
        .catch(function (error) {
            alert("Unable to connect to Weather Services");
        });
};





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



    // sends all inputs to fetch/userSearch
    userSearch(movieName, includeAdult, releaseDate)    //<========== CALL TO FETCH, COMMENTED FOR NOW
}






//================ FOURTH FUNCTION=========================//
// function checks to make sure year is 4 digits long, and is beyond 1887 (first movie 1888) and returns a year/integer
var releaseInput = function() {
    var dateInput = "2006"; //<========Change to grab from HTML/Search Box
    var dateInputConverted = parseInt(dateInput);    
    var dateInputCombined = dateInputConverted.toString();
    
    if (dateInputCombined.length === 4 && dateInputConverted > 1887) { // <====== first movie made in 1888, no need to search before then. Also verified after being parsed that the length is 4
        return dateInputConverted
    }  else {
        alert("Please enter a valid year") //<===================== Change to MODAL, make sure that when this loops to beginning of function it only removes and wants correct input from the YEAR search field
        var dateInput = ""
        releaseInput();
    }
}









//================ SECOND FUNCTION=========================//
//==================== function takes in search result for movie title and returns answer to "userSearchInformation, if user leaves blank then "any" is returned
//==================== this could also be an alert/modal if preferred.==================================//

var movieTitle = function(movieTitleInput) { //<====================== Ready
    
    var nameSearchResult = "";//===== searchEl.value;  //<======================= update to search box once done!

    if (nameSearchResult) {
        return nameSearchResult;
    } else if (nameSearchResult === "") {
        return nameSearchResult = "any"
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
        return finalRes = "true"; //<====================== Verify API can take capital True
    } else if (finalRes === "no") {
        return finalRes = "false"// <=================== Verify API can take capital False
    } else {
        return finalRes = "false" //<================= Default value is going to be No/False for safety
    }
}







userSearchInformation();
movieTitle("Avengers");
// userSearch(name, region, year, releaseYear);