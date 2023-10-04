const currentPage = 4

// Navbar Loader Module
import getNavBar from "./modules/navBar.js";
getNavBar(currentPage)

// Footer Loader Module
import getFooter from "./modules/loadFooter.js";
getFooter()

$("#WAForm").submit(function (e) { 
    e.preventDefault();
    console.log("uloaded");
    let userMSG = $("#message").val()
    window.open(`https://api.whatsapp.com/send?phone=972585109829&text=${userMSG}`, '_blank');
});


$(".navBtn").click(() => {
    $(".nav-list").addClass("nav-list-active");
    $("body").css("overflow", "hidden")
})
  
$(".navBtnList").click(() => {
  $(".nav-list").removeClass("nav-list-active");
  $("body").css("overflow", "scroll")
})