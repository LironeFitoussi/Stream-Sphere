export default function nextPage(page = 1, time, favArr) {
    window.scrollTo({
      top: 800,
      behavior: "smooth",
    });
    const settings = {
      async: true,
      crossDomain: true,
      url: `https://api.themoviedb.org/3/trending/movie/${time}?language=en-US&page=${page}`,
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkZjVmZTcyZGYwODg4MzgyZTQxNDhlMjFmNThjNzBiOCIsInN1YiI6IjY1MTVjNWQ0ZDQ2NTM3MDBjNjdiMmMxYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.2huECgDm-vl-quAM-E50mrdEymLQO4yHgmgrdfRa3vI",
      },
    };
  
    $.ajax(settings).done(function (data) {
        $(".moviesContainer").html("");
        const thisPageMovies = data.results;
        thisPageMovies.map((selectedMovie, movieIndex) => {
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
            if (window.innerWidth <= 425 ) {
              slideInfo.find("h1").css("font-size", "5csvw");
            } else {
              slideInfo.find("h1").css("font-size", "2vw");
            }
          }
  
          slideInfo.addClass("slideInfo");
  
          movieCard.attr("id", `movie_${movieIndex + 1}`);
          newMovie.attr(
            "src",
            `http://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
          );
          $(movieCard).append(slideInfo, newMovie);
  
          $(".moviesContainer").append(movieCard);
        });
  
        let starsArr = document.querySelectorAll(".fa-star");
        starsArr.forEach((star, index) => {
          star.addEventListener("click", () => {
            let favorite = star.classList.contains("fa-solid");
            if (favorite) {
              let keyToRemove = "id";
              let valueToRemove = data.results[index].id;
              star.classList.remove("fa-solid");
              favArr = favArr.filter(
                (item) => item[keyToRemove] !== valueToRemove
              );
            } else {
              favArr.push(data.results[index]);
              star.classList.add("fa-solid");
            }
            let localFavorites = JSON.stringify(favArr);
            localStorage.setItem("userFavMovies", localFavorites);
          });
        });
      })
      .catch((err) => console.error(err));
  }