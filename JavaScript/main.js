let chosenFilter = "day";
let clickedBtn = 1;

let favArr = new Array();
const currentPage = 1

let width = $(window).width();
let smallScreenDot = "" 
if (width <= 375) {
  smallScreenDot = "fa-2xs";
}

// Navbar Loader Module
import getNavBar from "./modules/navBar.js";
getNavBar(currentPage)

// Footer Loader Module
import getFooter from "./modules/loadFooter.js";
getFooter()

if (localStorage.userFavMovies) {
    favArr = JSON.parse(localStorage.userFavMovies)
}

function fetchMovies(time = "day") {
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://api.themoviedb.org/3/trending/movie/${time}?language=en-US&page=1`,
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjVmZTcyZGYwODg4MzgyZTQxNDhlMjFmNThjNzBiOCIsInN1YiI6IjY1MTVjNWQ0ZDQ2NTM3MDBjNjdiMmMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2huECgDm-vl-quAM-E50mrdEymLQO4yHgmgrdfRa3vI",
    },
  };

  $.ajax(settings).done(function (data) {
    //! Header
    const moviesArr = data.results;
    const tenTopMovies = [];

    for (let i = 0; i < 10; i++) {
      tenTopMovies.push(moviesArr[i]);
    }

    const genrePromise = fetchMovieGenres();

    let slideCount = 1;
    $("#rightSlide").click(function autoSlideRight() {
      if (slideCount == 10) {
        slideCount = 1;
      }
      $(`#topMovies_${++slideCount}`)[0].scrollIntoView({ behavior: "smooth" });
    });

    $("#leftSlide").click(() => {
      if (slideCount == 1) {
        slideCount = 11;
      }
      --slideCount;
      $(`#topMovies_${slideCount}`)[0].scrollIntoView({ behavior: "smooth" });
    });

    tenTopMovies.forEach((movie, index) => {
      const movieDate = new Date(movie.release_date);
      const newDiv = $("<div>");
      const movieContent = $("<div>");
      const movieTitle = movie.title;
      newDiv.addClass("topMovies");
      newDiv.attr("id", `topMovies_${index + 1}`);
      movieContent.addClass("movieContent");

      // Genre Promise
      genrePromise.then((genres) => {
        const genre = genres.find((genre) => genre.id === movie.genre_ids[0]);
        if (genre) {
          movieContent.find(".yearAndGenre span:last-child").text(genre.name);
        }

        if (movieTitle.length > 18) {
          movieContent.find("h1").addClass("longTitle");
        }
      });

      movieContent.append(`
            <h1>${movieTitle}</h1>
            <div class="yearAndGenre">
                <span>${movieDate.getFullYear()}</span>
                <i class="fa-solid fa-circle ${smallScreenDot}" style="color: #ffffff;"></i>
                <span></span>
            </div>
            <p>${movie.overview}</p>
        `);

      newDiv.css(
        "background-image",
        `url(http://image.tmdb.org/t/p/original${movie.backdrop_path})`
      );
      newDiv.append(movieContent);
      $(".moviesSlider").append(newDiv);

      //? setInterval(() => {
      //?    if (slideCount == 10) {
      //?         slideCount = 1
      //?     }
      //?     $(`#topMovies_${++slideCount}`)[0].scrollIntoView({behavior: 'smooth'});
      //? }, 5000);
    });

    //! Main
    nextPage(1, chosenFilter, favArr);

    //! Pagination
    const paginationElem = $("<div>");
    paginationElem.addClass("pagination");
    for (let i = 1; i <= 5; i++) {
      const newPageBtn = $("<a>");
      newPageBtn.addClass("pageBtn");
      newPageBtn.text(i);
      newPageBtn.attr("value", i);
      paginationElem.append(newPageBtn);
    }

    const lastPage = $("<a>");
    lastPage.text(`Next Page >> ${parseInt(clickedBtn)+1}`);
    lastPage.attr({ "value": clickedBtn, "id": "nextPage" });
    lastPage.addClass("pageBtn");
    paginationElem.append(lastPage);

    $("main").append(paginationElem);
    $(paginationElem).insertAfter("main");

    const pageBtnArr = document.querySelectorAll(".pageBtn");
    pageBtnArr[0].classList.add("active");
    
    let lastBtn = 0
    //! Pagination Listener
    pageBtnArr.forEach((page, index) => {
      page.addEventListener("click", () => {
        if (page.hasAttribute("id")) {
          clickedBtn++
          if (lastBtn === 4) {
            page.classList.add("active")
            pageBtnArr[lastBtn].classList.remove("active")
          }
          if (lastBtn <=4) {
            pageBtnArr[lastBtn].classList.remove("active")
            lastBtn++
            pageBtnArr[lastBtn].classList.add("active")

          }
        } else {
          if (lastBtn == 5) {
            $("#nextPage").removeClass("active")
          }
          pageBtnArr[lastBtn].classList.remove("active")
          page.classList.add("active")
          lastBtn = index
          clickedBtn = page.getAttribute("value");
        }

        lastPage.text(`Next Page >> ${parseInt(clickedBtn)+1}`);
        lastPage.attr("value", clickedBtn);
        console.log(lastBtn);
        setTimeout(() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
          });
        }, 50);
        nextPage(clickedBtn, chosenFilter, favArr);
      });
    });

    $("#chooseFilter").on("submit", (e) => {
      e.preventDefault();
      chosenFilter = $("#timeFilter").val();
      pageBtnArr[clickedBtn - 1].classList.remove("active");
      clickedBtn = 1;
      pageBtnArr[0].classList.add("active");
      nextPage(1, chosenFilter, favArr);
    });
  });
}

function fetchMovieGenres() {
  return fetch(
    "https://api.themoviedb.org/3/genre/movie/list?language=en&api_key=df5fe72df0888382e4148e21f58c70b8"
  )
    .then((response) => response.json())
    .then((data) => data.genres)
    .catch((err) => {
      console.error(err);
      return [];
    });
}


import nextPage from "./modules/nextPage.js";

fetchMovies(chosenFilter);

$(".navBtn").click(() => {
  $(".nav-list").addClass("nav-list-active");
  $("body").css("overflow", "hidden")
})

$(".navBtnList").click(() => {
  $(".nav-list").removeClass("nav-list-active");
  $("body").css("overflow", "scroll")
})



