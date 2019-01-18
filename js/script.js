addEventListener('load', function () {
    loadFavourites();
});
document.getElementById("searchbtn").addEventListener('click', function () {
        performSearch();
});
document.getElementById("search").addEventListener('keyup', function (e) {
    if (e.keyCode == 13) // if "Enter" was hit
        performSearch();
    else
        document.getElementById("results").innerHTML = "";
});
document.getElementById("results").addEventListener('click', function (e) {
    let toFavourite = e.target;
    if (toFavourite.nodeName == 'I')
        toFavourite = toFavourite.parentNode;
    if (toFavourite.nodeName == 'BUTTON') {
        if (toFavourite.className == "unfavourited") {
            localStorage.setItem(toFavourite.name, toFavourite.value);
            toFavourite.className = "favourited";
            addFavourite(toFavourite.value, toFavourite.name);
        } // end-if not favourited
        else {
            localStorage.removeItem(toFavourite.name);
            toFavourite.className = "unfavourited";
            unfavourite(document.getElementsByName(toFavourite.name)[1]); // to remove from favourites div
        }
    } // end-if star was pressed
});
document.getElementById("items").addEventListener('click', function (e) {
    let pressed = e.target;
    if (pressed.nodeName == 'I')
        pressed = pressed.parentNode;
    if (pressed.nodeName == 'BUTTON') {
        unfavourite(pressed);
    }
})
let performSearch = function () {
    if (document.getElementById("search").value != '' && document.getElementById("search").value != ',' && document.getElementById("search").value != ' ') {
        document.getElementById("error").textContent = "";
        let hasResults = false;
        let result = "<h1>Search Results</h1>"; // Render header to explain what div contains
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) !== 'count') {
                let currentObj = JSON.parse(decodeURIComponent(localStorage.getItem(localStorage.key(i))));
                if (currentObj["keywords"].includes(document.getElementById("search").value)) {
                    // Render body as HTML code
                    hasResults = true;
                    let body = document.createElement('div');
                    body.innerHTML = currentObj['body'];
                    result += `<div>
                        <button class ="favourited" name=${localStorage.key(i)} value="${localStorage.getItem(localStorage.key(i))}"><i class="fas fa-star"></i></button>
                        <p>${currentObj['title']}</p>
                        <div class="inner">${body.textContent}</div>
                    </div>`;
                }
            }
        }
        // perform API call
        fetch("https://secure.toronto.ca/cc_sr_v1/data/swm_waste_wizard_APR?limit=1000").then(function (resp) {
            return resp.json();
        }).then(function (info) {
            let count = 0;
            if (localStorage.count != undefined)
                count = localStorage.count;
            // if count variable is missing but favourites exist
            else if (localStorage.count == undefined && localStorage.length > 0) {
                //get the number of the last favourited item to reset count at that place
                let lastFave = localStorage.key(localStorage.length - 1);
                // favourite has 9 letters so last favourite number starts at 9th index
                count = lastFave.substring(9);
            }

            for (let i of info) {
                if (i['keywords'].includes(document.getElementById("search").value) && !searchFavourites(i)) {
                    hasResults = true;
                    count++;
                    // Render body as HTML code
                    let body = document.createElement('div');
                    body.innerHTML = i['body'];
                    // Using name instead of id below to prevent duplicate ids
                    result += `<div>
                    <button class="unfavourited" value=${encodeURIComponent(JSON.stringify(i))} name="favourite${count}"><i class="fas fa-star"></i></button>
                    <p>${i['title']}</p>
                    <div class="inner">${body.textContent}</div>
                </div>`;
                    localStorage.count = count;
                }
            }
            document.getElementById("results").innerHTML = result;
            if (!hasResults) {
                document.getElementById("results").innerHTML += "<h3>No results found</h3>"
            }
        })
    } // end-if valid query
    else {
        document.getElementById("error").textContent = "Please enter a valid query";
    }//if invalid query
}
// This function verifies if a result returned by the API call already exists in the favourites
let searchFavourites = function (result) {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)) == encodeURIComponent(JSON.stringify(result)))
            return true;
    }
    return false;
}
// This loads the favourites in the favourites div (#items child div)
let loadFavourites = function () {
     if(!checkEmpty()) {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) !== 'count') {
                let currentObj = localStorage.getItem(localStorage.key(i));
                addFavourite(currentObj, localStorage.key(i));
            }
        } //for
    }
}
let addFavourite = function (obj, faveName) {
    obj = JSON.parse(decodeURIComponent(obj));
    if (document.getElementById("items").textContent === "There are currently no favourited items.")
        document.getElementById("items").textContent = "";
    // Render body as HTML code
    let body = document.createElement('div');
    body.innerHTML = obj['body'];
    document.getElementById("items").innerHTML += `<div>
                <button class="favourited" name="${faveName}" value="${localStorage.getItem(faveName)}"><i class="fas fa-star"></i></button>
                <p>${obj['title']}</p>
                <div class="inner">${body.textContent}</div>
            </div>`;
}
// This function checks if there is no items favourited
let checkEmpty = function () {
    if ((localStorage.length == 1 && localStorage.count != undefined) || localStorage.length == 0) {
        document.getElementById("items").innerHTML = "<p>There are currently no favourited items.</p>";
        return true;
    }
    return false;
}
let unfavourite = function (clicked) {
    localStorage.removeItem(clicked.name);
        // Verifying if a search was performed before clicking the star
        if (document.getElementById("results").textContent.includes("Search Results"))
            document.getElementsByName(clicked.name)[0].className="unfavourited";
        let toRemove = clicked.parentNode; //selects the div
        document.getElementById("items").removeChild(toRemove);
        checkEmpty();
}
