const currentPage = 3;
let movieId = 0;
const favoriteMovies = [];
let isFetch = true 

// Navbar Loader Module
import getNavBar from "./modules/navBar.js";
getNavBar(currentPage);

// Footer Loader Module
import getFooter from "./modules/loadFooter.js";
getFooter();

$("#searchByID").submit(async function (e) {
  e.preventDefault();
  $("body").css("overflow", "scroll");
  movieId = $("#serachMovieInput").val();
  console.log(movieId);
  try {
    // Fetch Validation
    await isFetchValidation(movieId);
    
    // If validation passes, load content
    $("main").html("");
    $("#backgroundImg").remove();
    console.log("loaded");
    loadContent(movieId);
    $("main").addClass("main-active");
  } catch (error) {
    // If validation fails, handle the error
    isFetch = false
    const errorMessage = "Movie not found. Please enter a valid movie ID.";
    $(`<h1 class="error-message">${errorMessage}</h1>`).insertBefore("main");
    console.error("API request failed:", error);
    console.log(errorMessage);
    // You can choose to show an error message or take other actions here
  }
});

function isFetchValidation(movieId) {
  return new Promise((resolve, reject) => {
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjVmZTcyZGYwODg4MzgyZTQxNDhlMjFmNThjNzBiOCIsInN1YiI6IjY1MTVjNWQ0ZDQ2NTM3MDBjNjdiMmMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2huECgDm-vl-quAM-E50mrdEymLQO4yHgmgrdfRa3vI",
      },
    };

    $.ajax(settings)
      .done((response) => {
        // Resolve the promise with the API response
        resolve(response);
      })
      .fail((error) => {
        // Reject the promise with the error information
        reject(error);
      });
  });
}

function loadContent(movieId) {
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`,
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjVmZTcyZGYwODg4MzgyZTQxNDhlMjFmNThjNzBiOCIsInN1YiI6IjY1MTVjNWQ0ZDQ2NTM3MDBjNjdiMmMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2huECgDm-vl-quAM-E50mrdEymLQO4yHgmgrdfRa3vI",
    },
  };

  $.ajax(settings)
    .done(function (response) {
      // Ensure if has Error MSG before:
      if (!isFetch) {
        console.log("test2");
        $(".error-message").remove()
      }

      // Hide Filter
      const hideFilter = $("<div>")
      hideFilter.attr("id", "hideFilter")
      hideFilter.css({
        "display":"contents",
        "position":"absolute",
        "background-color": "#000",
        "width": "100vw",
        "height": "100vh",
        "z-index":"200",
        "opacity": 0,
        "transition":"all 0.6s"
      });
      $("main").append(hideFilter)

      // Back Button
      let isActive = false
      const backBtn = $("<div>")
      backBtn.addClass("backBtn")
      backBtn.html(`<i class="fa-solid fa-arrow-right" style="color: #ffffff;"></i>`)
      $("main").append(backBtn);

      $(backBtn).click(() => { 
        console.log(isActive);
        if (!isActive) {
          console.log("click2");
          $("main").removeClass("main-active")
          backBtn.addClass("backBtn-active")
          isActive = true 
          $("body").css("overflow", "hidden")
          $("#hideFilter").css({
            "opacity":"0.8", 
            "display":"block"
          })
        } else {
          $("main").addClass("main-active")
          backBtn.removeClass("backBtn-active")
          isActive = false
          $("body").css("overflow", "scroll")
          $("#hideFilter").css("opacity","0")
        }
      });

      

      // Set Background
      let mainBackground = response.backdrop_path;
      const backgroundImg = $("<img>");
      if ($(window).width() <= 375) {
        backgroundImg.attr({
          src: `http://image.tmdb.org/t/p/original${mainBackground}`,
          id: "backgroundImg",
        });
        $("main").append(backgroundImg);
      } else {
        backgroundImg.attr({
          src: `http://image.tmdb.org/t/p/original${mainBackground}`,
          id: "backgroundImg",
        });
        $(backgroundImg).insertBefore("main");
      }

      // main Movie Details
      const mainMovieInfo = $("<article>");
      const releaseDate = new Date(response.release_date);
      const runTime = new Date(response.runtime * 60 * 60);
      const trailerIdPromise = fetchVideoTrailer(movieId);
      trailerIdPromise.then((data) => {
        console.log();
        const videoKey = data.results[0].key;
        $("iframe").attr(
          "src",
          `https://www.youtube-nocookie.com/embed/${videoKey}?si=4ZJBUdvHa240g8LV`
        );
        trailerKey = data.results[0].key;
      });
      mainMovieInfo.addClass("mainMovie");
      mainMovieInfo.append(
        `
          <div >
            <h1>${response.title}</h1>
            <span>${releaseDate.getFullYear()} | Duration: 
            ${parseInt(runTime.getTime() / 60 / 60 / 60) + "h" + ((runTime.getTime() / 60 / 60) % 60)} 
            </span>
            <hr>
            <span id="movieDirector"></span>
            <p>${response.overview}</p>
            <a href="https://www.imdb.com/title/${response.imdb_id}">
                <img id="imdbLogo" src="../Assets/IMDB_Logo_2016.svg.png">
            </a>
            <br>
            <iframe title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          </div>
          <img id="moviePoster" src=http://image.tmdb.org/t/p/original${response.poster_path}></img>
        `
      );
      $("main").append(mainMovieInfo);

      const castTitle = $("<h1>")
      castTitle.addClass("castTitle")
      castTitle.text("Cast");
      $("main").append(castTitle);

      // Actors
      const actorPromise = fetchMovieCredits(movieId);
      const actors = $("<div>");
      actors.addClass("actorsCont");
      actorPromise.then((data) => {        
        // Director
        const crewArr = data.crew;
        const movieDirector = crewArr.find((crew) => crew.job == "Director");
        $("#movieDirector").html(
          `<strong>Directed By:</strong> ${movieDirector.name}`
        );

        // Cast
        
        for (const int of data.cast) {
          const actorCard = $("<div>");
          actorCard.addClass("actorCard");
          const actorPic = $("<img>");
          actorPic.addClass("actorPic");
          let actorPicAdress = `http://image.tmdb.org/t/p/original${int.profile_path}`;
          if (actorPicAdress == "http://image.tmdb.org/t/p/originalnull") {
            actorPicAdress =
              "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/fd35c-no-user-image-icon-27.png?fit=500%2C500&ssl=1";
          }
          actorPic.attr("src", actorPicAdress);
          actorCard.append(
            actorPic,
            `
                    <h1>${int.name}</h1> 
                    <span>${int.character}</span>
                `
          );
          actors.append(actorCard);
        }
      });
      $("main").append(actors);
    })
}

function fetchMovieCredits(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?language=en-US`;
  return new Promise((resolve, reject) => {
    const settings = {
      async: true,
      crossDomain: true,
      url: url,
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjVmZTcyZGYwODg4MzgyZTQxNDhlMjFmNThjNzBiOCIsInN1YiI6IjY1MTVjNWQ0ZDQ2NTM3MDBjNjdiMmMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2huECgDm-vl-quAM-E50mrdEymLQO4yHgmgrdfRa3vI",
      },
    };

    $.ajax(settings)
      .done((response) => {
        resolve(response);
      })
      .fail((error) => {
        reject(error);
      });
  });
}

function fetchVideoTrailer(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
  return new Promise((resolve, reject) => {
    const settings = {
      async: true,
      crossDomain: true,
      url: url,
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjVmZTcyZGYwODg4MzgyZTQxNDhlMjFmNThjNzBiOCIsInN1YiI6IjY1MTVjNWQ0ZDQ2NTM3MDBjNjdiMmMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2huECgDm-vl-quAM-E50mrdEymLQO4yHgmgrdfRa3vI",
      },
    };

    $.ajax(settings)
      .done((response) => {
        resolve(response);
      })
      .fail((error) => {
        reject(error);
      });
  });
}

if (movieId != 0) {
  fetchVideoTrailer(movieId);
  loadContent(movieId);
}

$(".navBtn").click(() => {
  $(".nav-list").addClass("nav-list-active");
  $("body").css("overflow", "hidden");
});

$(".navBtnList").click(() => {
  $(".nav-list").removeClass("nav-list-active");
  $("body").css("overflow", "scroll");
});
