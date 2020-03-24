$().ready(function() {
  $("#tweet-text").on("input", () => {
    let number = Number($("#counter").text());
    let chars = document.getElementById("tweet-text").value;
    let numOfChars = chars.length;
    number = +numOfChars;
    $("#counter").text(140 - number);
    if (140 - number < 0) {
      console.log("red");
      document.getElementById("counter").style.color = "red";
    } else {
      document.getElementById("counter").style.color = "gray";
    }
  });
});
