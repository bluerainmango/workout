$(document).ready(function() {
  //   M.AutoInit();
  $(".carousel").carousel({
    padding: 10,
    indicators: true,
    // noWrap: true,
    dist: 0,
    numVisible: 3,
    shift: 10
  });

  var instance = M.Carousel.getInstance(
    document.getElementsByClassName(".carousel")
  );

  console.log("🍐 ", instance);
  console.log("🍐 ", instance.pressed);
  document.getElementsById("d").addEventListener("click", function(e) {
    console.log("clicked");
  });
});
