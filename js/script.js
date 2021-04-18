// Elements and Objects
let fetchStarshipsBtn = document.getElementById('fetchStarships'),
    sortStarshipsDropdown = document.getElementById('sortStarshipsBy'),
    starshipData = document.getElementById('starshipData'),
    starshipsArray = [];

/**
 * Fetches all starship data
 *
**/
const fetchAllStarships = async () => {
   // disable fetch button (so only 1 request is made)
   fetchStarshipsBtn.setAttribute('disabled', true);
   // fetch starships data
   await requestDataFromUrl('https://swapi.dev/api/starships/');
}

/**
 * Returns response from url and sends to fetchStarships for formatting
 *
 * @param   {string}    url     string.
 * @return  {object}    returns response from url
**/
const requestDataFromUrl = async (url) => {
   // fetch data with given url
   let responseData = await fetch(url)
         .then(response => {
            // return response in json
            return response.json();
         }).catch((error) => {
            console.error(`Error: Failed to fetch URL ${url} - ${error}`);
         });

   if (responseData) {
      fetchStarships(responseData);
   }
}

/**
 * Assigns starship data into array from results of response
 * If there is additional, fetches remaining data
 * Once complete, creates html markup for each spaceship
 * Removes disabled attribute from dropdown for sorting purposes
 *
 * @param   {object}    responseData     response from url.
**/
const fetchStarships = async (responseData) => {
   // for each starship in the list of results, add it to the starships array
   for (const starship of responseData.results) {
      starshipsArray.push(starship);
    }
   // if the data says theres more (indicated by data.next), fetch the additional data
   if (responseData.next) {
      await requestDataFromUrl(responseData.next);
   } else {
      // once all data has been fetched, map through the list and create html row for each starship
      starshipsArray.map(displayStarship);
      // once html is generated, enable sorting dropdown
      sortStarshipsDropdown.removeAttribute('disabled');
   }
 }

/**
 * Converts the string to be hyphenated
 *
 * @param   {string}    str     string.
 * @return  {string}    returns name in formatted string.
**/
 const hyphenateName = (str) => {
   return str.toLowerCase().replace(/ /g, '-');
 }

 /**
 * Appends single row of starship data to DOM
 *
 * @param   {object}    starship     object of starship data.
**/
 const displayStarship = (starship) => {
    // append starship row to table
   starshipData.innerHTML += `<div class="starship-table__row ${hyphenateName(starship.name)}">
      <div class="starship-table__column">${starship.name}</div>
      <div class="starship-table__column">${starship.model}</div>
      <div class="starship-table__column">${starship.manufacturer}</div>
      <div class="starship-table__column">${starship.cost_in_credits}</div>
      <div class="starship-table__column">${starship.length}</div>
      <div class="starship-table__column">${starship.passengers}</div>
      <div class="starship-table__column">${starship.cargo_capacity}</div>
   </div>`;
}

/**
 * Compares two sets of data of the specified property
 *
 * @param   {string}    property     string.
 * @return  {number}    returns data in desired order.
**/
// function to sort the array by the given property
const sortByProperty = (property) => (a, b) => {
   // specified property of starshipA and starshipB i.e. if property = name, an example would be CR90 Corvette
   // removes commas and converts data to lowercase to avoid casing and data formatting discrepancies
   // specifies whether data needs to be compared in numerical format otherwise it will be sorted in string format
   let starshipA = a[property].replace(',', '').toLowerCase(),
       starshipB = b[property].replace(',', '').toLowerCase(),
       numericalCompare = (property == 'cargo_capacity' || property == 'length' || property == 'passengers' || property == 'cost_in_credits');

      //  if it needs numerical comparison, converts data to number format, sorts numbers in ascending order, if data can't be converted to number, we return infinity so we can append the data to the end of the list
      if (numericalCompare) return Number(starshipA)-Number(starshipB) || (Number(starshipA)||Infinity)-(Number(starshipB)||Infinity) || 0;
      //  if starshipA preceeds starshipB, return 1 (starshipA before starshipB)
      if (starshipA > starshipB) return 1;
      //  if starshipB preceeds starshipA, return -1 (starshipB before starshipA)
      if (starshipA < starshipB) return -1;
      //  otherwise, starshipA and starshipB are equal, leave as is
      return 0;
}

/**
 * Sorts and displays starship data in ascending order by property
 *
 * @param   {string}    category     desired category/property to sort by.
**/
const sortBy = (category) => {
   // 1. empty table data
   starshipData.innerHTML = '';

   // 2. sort table by specified category
   starshipsArray.sort(sortByProperty(category))

   // 3. display each starship in table
   starshipsArray.map(displayStarship);
}

//  Event Listeners
fetchStarshipsBtn.addEventListener('click', fetchAllStarships);
sortStarshipsDropdown.addEventListener('input', event => {
   sortBy(event.target.value);
});