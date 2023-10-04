export default function getNavBar(currentPage) {
  console.log("Nav Loaded");
  const navContent = $("<nav>");
  navContent.html(
    `
        <div class="navbar">
            <div class="logo">
                <img src="../Assets/favicon.ico" alt="Logo">
            </div>
            <div>
              <div class="navBtn">
                <i class="fa-solid fa-bars" style="color: #fff;"></i>
              </div>
            </div>
            <ul class="nav-list">
                <div class="navBtnList">
                <i class="fa-solid fa-x" style="color: #ffffff;"></i>
                </div>
                <li class="pageFinder"><a href="./index.html">Home</a></li>
                <li class="pageFinder"><a href="./searchMovie.html">Search</a></li>
                <li class="pageFinder"><a href="./singleById.html">Movies ID</a></li>
                <li class="pageFinder"><a href="./about.html">About</a></li>
                <li class="pageFinder"><a href="./favorites.html">Favorites</a></li>
            </ul>
        </div>
    `
  );

  
  $("#navbarDropdownMenuLink").click(function () {
    console.log("click");
    let dropdown = $("#sbw");
    dropdown.toggle();
  });
  $(navContent).insertBefore("header");

  const navLinks = $(".pageFinder");
  navLinks.map((link, index) => {
    console.log();
    if (link+1 === currentPage) {
      $(index).attr("id","active");
      $(index).find("a").attr("id","active");
    }
  });

}
