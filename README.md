# Shopify Web Engineer Challenge 2019
### A web application to search the Toronto Waste Wizard database for waste items with the ability to favourite the ones that are used more often. It is an application built using pure JavaScript.

## Favourites
Adding a favourite renders a green star for that specific item and that item gets added to the list of favourites at the bottom. The list of favourites is always displayed at the bottom of the screen. The favourited items show up with a green star button in both the search results area and the favourites area. That button can be clicked to unfavourite the item.

## Searching
When performing a search, the application starts off by:
 - searching favourites and adds them to the top of the list and renders a green star button;
 - performs the API call to search the database and finally;
 - checks if the result already exists in favourites. If it does, then that item is not redisplayed as it is already displayed with the favourites. Otherewise, the item is displayed with the grey star button.

Any edit made to the search field will clear the results.

A blank search field, searching for one comma (',') or searching for a space (' ') will return an error.
