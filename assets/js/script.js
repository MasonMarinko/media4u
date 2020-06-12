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
    // save all authors in array
    var authors = [];
    for (i = 0; i<authorsArray.length; i++) {
        var newAuthor = authorsArray[i];
        authors.push(newAuthor);
    }
    // create book object
    var bookObject = {
        title: title,
        imageUrl: imageUrl,
        description: description,
        authors: authors
    }
    console.log(bookObject);
    // send bookObject to DOM element creator function
    // bookContentCreator(bookObject);
};

submitButtonEl.addEventListener("click", formHandler);