var mediaSelectEl = document.getElementById("media-select");
var searchInputEl = document.getElementById("search-input");
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
    }
    else if (selectedMedia === "music") {
        console.log("sent to music");
        // send searchTerm to music fetch function
        // musicFetchHandler(searchTerm);
    }
    else if (selectedMedia === "books") {
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

mediaSelectEl.addEventListener("change", mediaSelectHandler);
submitButtonEl.addEventListener("click", formHandler);
