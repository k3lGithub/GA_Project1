# GA_Project1: My first application


### Summary:
This App provides the current status of covid19 cases across the countries. 
Page incldues an input field where user can search for country names which returns the data represented in table and google map.
A short quiz which displays answers on click follows after.


### Technologies used:
- jquery-3.5.1.min.js
- jquery-ui.js 1.12.1
- bootstrap.min.js 4.5.0
- moment.js 2.26.0
- APIs (google map api, rapidapi)


### Features:
- Auto suggestion search input
- Field validations
- Visual data presentation in table format
- Google Map
  - Focus view with markers
  - Information Window on click
  - Marker Animation
- Quiz
  - Displays answers on click


### Challenges and Improvements:
* API account limitation to getDialyReportAllCountries
* **Challenge** faced in finding radio button element to disable all. **Current Solution:** called function inside "on ready" function for element to be ready
* **Challenge** faced in repeating all quiz question sets. **Current Solution:** provided index and seperated 2 functions for initial preparation and to prepare next question
* Further **Improvements** can be done to:
  * remove previous markers on map
  * explore the use of local storage
  * previous and next quiz flow