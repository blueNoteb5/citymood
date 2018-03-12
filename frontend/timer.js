var twitterid = ["montreal", "toronto","vancouver","calgary", "edmonton", "hamilton", "winnipeg", "kitchener", "ottawa"];

var i = 1;
function twitterTimeline () {

  if (i >= twitterid.length) {
    i = 0;
  }
      var k = twitterid.length-1;
      if(i-1 < 0) {
        document.querySelector("#" + twitterid[k]).style.display = "none"
      }
      else {
        document.querySelector("#" + twitterid[i-1]).style.display = "none"
      }
      document.querySelector("#" + twitterid[i]).style.display = "inline-block";
      i++;

}


  setInterval (twitterTimeline, (3000*2));
