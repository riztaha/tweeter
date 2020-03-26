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
          ${tweet}
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

// createTweetElement(tweetData);

// this function needed to be moved below createTweetElement()
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
  // Our input starts off with "text=" so we will have to subtract 5 from the total length of the input.
  if (input.length - 5 > 140) {
    console.log("Sorry cannot submit this tweet!");
    alert("Sorry cannot submit this tweet due to it's length!");
  } else if (input.length - 5 === 0) {
    alert("Please enter content to tweet.");
    console.log("Sorry cannot submit this tweet!");
  } else {
    $.ajax({
      url: "/tweets",
      type: "POST",
      data: input
    })
      .then(() => {
        loadTweet();
        console.log("Submitting Tweet");
      })
      .catch(err => {
        console.log("Error", err);
      });
  }
};

const loadTweet = () => {
  $.ajax({
    url: "/tweets",
    type: "GET",
    datatype: "JSON"
  })
    .then(response => {
      console.log("Retrieving Tweet");
      //   console.log(response);
      renderTweets(response);
      console.log("Data Retrieved!");
    })
    .catch(err => {
      console.log("Error", err);
    });
};
