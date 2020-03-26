/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

// const tweetData = {
//   user: {
//     name: "Newton",
//     avatars: "https://i.imgur.com/73hZDYK.png",
//     handle: "@SirIsaac"
//   },
//   content: {
//     text: "If I have seen further it is by standing on the shoulders of giants"
//   },
//   created_at: 1461116232227
// };

// const data = [
//   {
//     user: {
//       name: "Newton",
//       avatars: "https://i.imgur.com/73hZDYK.png",
//       handle: "@SirIsaac"
//     },
//     content: {
//       text:
//         "If I have seen further it is by standing on the shoulders of giants"
//     },
//     created_at: 1461116232227
//   },
//   {
//     user: {
//       name: "Descartes",
//       avatars: "https://i.imgur.com/nlhLi3I.png",
//       handle: "@rd"
//     },
//     content: {
//       text: "Je pense , donc je suis"
//     },
//     created_at: 1461113959088
//   }
// ];

const createTweetElement = database => {
  const name = database.user["name"];
  const avatar = database.user["avatars"];
  const handle = database.user["handle"];
  const tweet = database.content.text;
  const creation = database.created_at;
  //   const { name, avatar, handle } = database;

  // const { name, avatars, handle } = database.user;
  // console.log(database.user, " =====> database.user");
  // console.log(name, avatars, handle);
  //   console.log(database);

  //   const { text } = database.content;
  //   const { created_at } = database;
  //   console.log(text, created_at);

  return `<article>
      <header class="tweet-header">
      <img src="${avatar}">
      ${name}
      <container class="handle">${handle}</container>
      </header>
      <main class="tweet-main">
      <container class="text">
          ${escape(tweet)}
      </container>
      </main>
      <footer class="tweet-footer">
      Created ${creation}
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
    $result = createTweetElement(tweet);
    $(".tweets-container").append($result);
  }
};

// AJAX will be used below
// Calling on the form where the button is located
$(".form").on("submit", event => {
  //   console.log("Clicked!");
  event.preventDefault();
  submitTweet();
});

const submitTweet = () => {
  const input = $(".form").serialize();
  //   $("<div>").text(input);
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
        // $(".tweets-container").empty();
        loadTweets();
        console.log("Submitting Tweet");
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
};

const loadTweets = () => {
  $.ajax({
    url: "/tweets",
    type: "GET",
    datatype: "JSON"
  })
    .then(response => {
      console.log("Retrieving Tweet");
      //   console.log(response.reverse())
      $(".tweets-container").empty();
      renderTweets(response.reverse());
      //   for (let tweet of response) {
      // console.log(tweet);
      // createTweetElement(tweet);
      //   }
    })
    .catch(err => {
      console.log("Error", err);
    });
};

// const loadTweets = () => {
//   $.get("/tweets", function(tweets) {
//     for (let tweet of tweets) {
//       const $addTweet = createTweetElement(tweet);
//       $("#tweet-container").prepend($addTweet);
//     }
//   });
// };

const escape = function(str) {
  let div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const errMsgSlide = msg => {
  if (
    $(`.${msg}`)
      .first()
      .is(":hidden")
  ) {
    $(`.${msg}`).slideDown("slow");
  } else {
    $(`.${msg}`).hide();
  }
};
