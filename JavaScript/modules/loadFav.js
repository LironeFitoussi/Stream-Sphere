
export default function loadFav(favArr) {
    console.log("loadFav Loaded");
    console.log("entered");
        $("main").html("")
        const thisPageMovies = favArr;
        thisPageMovies.map((selectedMovie, movieIndex) => {
            const movieCard = $("<div>")
            movieCard.addClass("movieCard")
            const newMovie = $("<img>");
            newMovie.addClass("movieImg")
            const movieDate = new Date(selectedMovie.release_date);

            // hiddenSlide
            const slideInfo = $("<div>")
            const movieTitle = selectedMovie.title
            
            slideInfo.html(`
                <h1>${movieTitle}</h1>
                <span>${movieDate.getFullYear()}</span>
                <p>${selectedMovie.overview}</p>
            `)

            // Favorite
            const mainStar = $("<div>")
            mainStar.addClass(`fa-star fa-regular`)
            mainStar.css("color", "#fbd723")
            slideInfo.append(mainStar)

            // check if already Fav
            favArr.map(movie => {
                if (movie.id == selectedMovie.id) {
                    mainStar.addClass(`fa-solid`)
                }
            })

            if (movieTitle.length > 15) {
                slideInfo.find("h1").css("font-size", "2vw");
            }

            slideInfo.addClass("slideInfo")

            movieCard.attr("id", `movie_${movieIndex+1}`)
            newMovie.attr("src", `http://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`)
            $(movieCard).append( slideInfo, newMovie)

            $("main").append(movieCard)
        })

        let starsArr = document.querySelectorAll(".fa-star");
        starsArr.forEach((star, index) => {
            star.addEventListener("click", () => {
                let keyToRemove = "id";
                let valueToRemove = favArr[index].id;      
                star.classList.remove("fa-solid");
                favArr = favArr.filter(item => item[keyToRemove] !== valueToRemove)
                console.log(favArr);
                // syncToLocalStorage
                let localFavorites = JSON.stringify(favArr)
                localStorage.setItem("userFavMovies", localFavorites)
                location.reload();
            });
        });
}