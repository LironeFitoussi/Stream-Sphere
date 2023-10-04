const currentPage = 2;
let favArr = new Array

if (localStorage.userFavMovies) {
    favArr = JSON.parse(localStorage.userFavMovies)
}

// Navbar Loader Module
import getNavBar from "./modules/navBar.js";
getNavBar(currentPage)

// Footer Loader Module
import getFooter from "./modules/loadFooter.js";
getFooter()

// Movie Search Module
import getMovieByName from "./modules/moviesNameList.js";

export let clickedBtn = 1;

$("#searchByName").submit(function (e) { 
    e.preventDefault();
    const movieName = $("#serachMovieInput").val()
    console.log(movieName);
    getMovieByName(movieName, favArr, clickedBtn)
});

$(".navBtn").click(() => {
    $(".nav-list").addClass("nav-list-active");
    $("body").css("overflow", "hidden")
  })
  
  $(".navBtnList").click(() => {
    $(".nav-list").removeClass("nav-list-active");
    $("body").css("overflow", "scroll")
  })