addEventListener('load', function () {
    loadFavourites();
});
document.getElementById("searchbtn").addEventListener('click', function () {
    if (document.getElementById("search").value !== '') {
        performSearch();
    } else
        document.getElementById("results").innerHTML = "";
});
document.getElementById("search").addEventListener('keyup', function () {
    document.getElementById("results").innerHTML = "";
});
document.getElementById("results").addEventListener('click', function (e) {
    let toFavourite = e.target;
    if (toFavourite.nodeName.toUpperCase() == 'I')
        toFavourite = toFavourite.parentNode;
    if (toFavourite.nodeName.toUpperCase() == 'BUTTON') {
        if (toFavourite.className == "unfavourited") {
            localStorage.setItem(toFavourite.id, toFavourite.value);
            toFavourite.className = "favourited";
        } // end-if not favourited
        else {
            localStorage.removeItem(toFavourite.value);
            toFavourite.className = "unfavourited";
        }
        performSearch();
        loadFavourites();
    } // end-if star was pressed
});
let performSearch = function () {
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
                        <button class ="favourited" value=${localStorage.key(i)}><i class="fas fa-star"></i></button>
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
                result += `<div>
                    <button class="unfavourited" value=${encodeURIComponent(JSON.stringify(i))} id="favourite${count}"><i class="fas fa-star"></i></button>
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
}
let searchFavourites = function (result) {
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.getItem(localStorage.key(i)) == encodeURIComponent(JSON.stringify(result)))
            return true;
    }
    return false;
}
let loadFavourites = function () {
    let result = '';
    if ((localStorage.length == 1 && localStorage.count != undefined) || localStorage.length == 0) {
        result = "<p>There are currently no favourited items.";
    } else {
        for (let i = 0; i < localStorage.length; i++) {
            if (localStorage.key(i) !== 'count') {
                let currentObj = JSON.parse(decodeURIComponent(localStorage.getItem(localStorage.key(i))));
                // Render body as HTML code
                let body = document.createElement('div');
                body.innerHTML = currentObj['body'];
                // id used as value to prevent duplicate ids
                result += `<div>
                            <button class="favourited" value="${localStorage.key(i)}"><i class="fas fa-star favourited"></i></button>
                            <p>${currentObj['title']}</p>
                            <div class="inner">${body.textContent}</div>
                        </div>`;
            }
        } //for
    }
    document.getElementById("items").innerHTML = result;
}