//Pop-up to set user's name
//Currently missing functionality so that user can add tweets with their own name/handle attached.
function myName() {
  let name = prompt("Please enter your name:", "Anonymous");
  if (name == null || name == "") {
    name = "Anonymous";
  }
  document.getElementById("name").innerHTML = name;
}

setTimeout(() => {
  myName();
}, 500);

const createTweetElement = database => {
  const { name, avatars, handle } = database.user;
  const { text } = database.content;
  //To get the full date properly written:
  const fullDate = new Date(database.created_at);
  const date =
    fullDate.getUTCMonth() +
    1 +
    "/" +
    fullDate.getUTCDate() +
    "/" +
    fullDate.getFullYear();

  return `<article>
      <header class="tweet-header">
      <img src="${avatars}">
      ${name}
      <container class="handle">${handle}</container>
      </header>
      <main class="tweet-main">
      <container class="text">
          ${escape(text)}
      </container>
      </main>
      <footer class="tweet-footer">
      Created ${date}
      <container class='social'>
          <img src="/images/flag.png" alt="">
          <img src="/images/retweet.png" alt="">
          <img src="/images/heart.png" alt="">
      </container>
      </footer>
  </article>
  `;
};

const renderTweets = tweets => {
  for (const tweet of tweets) {
    let $result = createTweetElement(tweet);
    $(".tweets-container").append($result);
  }
};

// AJAX will be used below
// Calling on the form where the button is located
$(".form").on("submit", event => {
  event.preventDefault();
  submitTweet();
});

const submitTweet = () => {
  const input = $(".form").serialize();
  //Counting the number of characters in the textbox.
  let chars = document.getElementById("tweet-text").value;
  let numOfChars = chars.length;
  if (numOfChars > 140) {
    //Error msg function located at bottom.
    errMsgSlide("err-msg1");
  } else if (numOfChars === 0) {
    errMsgSlide("err-msg2");
  } else {
    $.ajax({
      url: "/tweets",
      type: "POST",
      data: input
    })
      .then(() => {
        loadTweets();
        console.log("Submitting Tweet");
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
};

const loadTweets = () => {
  errMsgHide("err-msg1");
  errMsgHide("err-msg2");
  $.ajax({
    url: "/tweets",
    type: "GET",
    datatype: "JSON"
  })
    .then(response => {
      console.log("Retrieving Tweets");
      $(".tweets-container").empty();
      renderTweets(response.reverse());
    })
    .catch(err => {
      console.log("Error", err);
    });
};

// Cross-site scripting function
const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

//Error handling
const errMsgSlide = msg => {
  if ($(`.${msg}`).is(":hidden")) {
    $(`.${msg}`).slideDown("slow");
  } else {
    $(`.${msg}`).slideUp("slow");
  }
};

const errMsgHide = msg => {
  $(`.${msg}`).slideUp("slow");
};

// Toggle for Submit Tweet button
const showForm = () => {
  // $(".form").slideDown("slow");
  if ($(".form").is(":hidden")) {
    $(".form").slideDown("slow");
  } else {
    $(".form").slideUp("slow");
  }
  $(".form")[0].scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
};

//Loads all previous tweets as soon as the page loads up
loadTweets();
