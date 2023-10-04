let mainMovie = ""
let isPagination = false;
let clickedBtn = 1;

export default function getMovieByName(movieName, favArr, clickedBtn) {
  const settings = {
    async: true,
    crossDomain: true,
    url: `https://api.themoviedb.org/3/search/movie?query=${movieName}&include_adult=false&language=en-US&page=${clickedBtn}`,
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjVmZTcyZGYwODg4MzgyZTQxNDhlMjFmNThjNzBiOCIsInN1YiI6IjY1MTVjNWQ0ZDQ2NTM3MDBjNjdiMmMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2huECgDm-vl-quAM-E50mrdEymLQO4yHgmgrdfRa3vI",
    },
  };
  $.ajax(settings).done(function (data) {
    $("main").html("");
    mainMovie = movieName
    const thisPageMovies = data.results;
    console.log(data);
    thisPageMovies.map((selectedMovie, movieIndex) => {
      let poster = `http://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
      if (poster == "http://image.tmdb.org/t/p/w500null") {
        poster = `https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png`
      }
      const movieCard = $("<div>");
      movieCard.addClass("movieCard");
      const newMovie = $("<img>");
      newMovie.addClass("movieImg");
      const movieDate = new Date(selectedMovie.release_date);

      // hiddenSlide
      const slideInfo = $("<div>");
      const movieTitle = selectedMovie.title;

      slideInfo.html(`
                  <h1>${movieTitle}</h1>
                  <span>${movieDate.getFullYear()}</span>
                  <p>${selectedMovie.overview}</p>
              `);

      // Favorite
      const mainStar = $("<div>");
      mainStar.addClass(`fa-star fa-regular`);
      mainStar.css("color", "#fbd723");
      slideInfo.append(mainStar);

      // check if already Fav
      favArr.map((movie) => {
        if (movie.id == selectedMovie.id) {
          mainStar.addClass(`fa-solid`);
        }
      });


      if (movieTitle.length > 15) {
        var width = $(window).width(); 
        if (width <= 375) {
          slideInfo.find("h1").css("font-size", "5vw");
        } else {
          slideInfo.find("h1").css("font-size", "2vw");
        }
        
      }

      slideInfo.addClass("slideInfo");

      movieCard.attr("id", `movie_${movieIndex + 1}`);
      newMovie.attr(
        "src",poster
      );
      $(movieCard).append(slideInfo, newMovie);

      $("main").append(movieCard);
    });

    let starsArr = document.querySelectorAll(".fa-star");
    starsArr.forEach((star, index) => {
      star.addEventListener("click", () => {
        let favorite = star.classList.contains("fa-solid");
        if (favorite) {
          let keyToRemove = "id";
          let valueToRemove = data.results[index].id;
          star.classList.remove("fa-solid");
          favArr = favArr.filter((item) => item[keyToRemove] !== valueToRemove);
        } else {
          favArr.push(data.results[index]);
          star.classList.add("fa-solid");
        }
        let localFavorites = JSON.stringify(favArr);

        
        localStorage.setItem("userFavMovies", localFavorites);
      });
    });

    const paginArr = document.querySelectorAll(".pageBtn")
    $(".pagination").find(".active").removeClass("active")
    paginArr[clickedBtn-1].classList.add("active")
  
  });

  if (!isPagination) {
    console.log("Paginator Loaded");
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
        topFunction()
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
        getMovieByName(mainMovie, favArr, clickedBtn);
      });
    });
    isPagination = true
  }
}

function topFunction() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
