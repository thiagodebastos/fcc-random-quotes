
// Revealing module pattern
const getQuote = (() => {
  // cache ids
  const quoteButton = document.getElementById('quoteButton');
  const quoteBoxContent = document.getElementById('quotebox--quote-js');
  const quoteBoxAuthor = document.getElementById('quotebox--author-js');

  // create a random number to be used when retriving quote index
  const random = (numOfQuotes) => {
    const x = Math.floor(Math.random() * (numOfQuotes));
    return x;
  };
  /*
  NOTE: One option was to use an object, but this left double-quotes
  in the results. I removed the quotes with .match(/\"/g, "")
  but supposedly regex slows down performance.
  ===========================================================
  const quote = {
    author: "Krishnamurti",
    quote: "You are the world and the world is you.",
  };

  // put in $.getJSON callback:
  // from: http://stackoverflow.com/a/14389539/3108412
  quote.author = data.quotes[num].author;
  quote.quote = data.quotes[num].quote;
  quoteBoxContent.text(JSON.stringify(data.quotes[num].quote));
  quoteBoxAuthor.text(JSON.stringify(data.quotes[num].author));
  ===========================================================*/

  /*
  TODO: Each time the function is called a JSON request is made.
        To improve performance, cache array results and check if
        they already exist. One way to do this is to use a
        `checked` variable and fetch data after an if statement.
  */
  /*
  function fetchQuote() {
    const quote = [];
    $.getJSON('./data/quotes.json', (data) => {
      const num = random(0, data.quotes.length);
      quote.push(data.quotes);
      $(quoteBoxContent).text(quote[0][num].quote);
      $(quoteBoxAuthor).text(quote[0][num].author);
    });
  };
*/

  function promisedQuote(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(this.responseText);
      };
      xhr.onerror = reject;
      xhr.open('GET', url);
      xhr.send();
    });
  }

  promisedQuote('./data/quotes.json')
  .then((result) => {
    const quotes = JSON.parse(result); // quotesExist = true
    const num = random(quotes.quotes.length);
    const quote = quotes.quotes[num].quote;
    const author = quotes.quotes[num].author;
    quoteBoxContent.innerHTML = JSON.stringify(quote);
    quoteBoxAuthor.innerHTML = JSON.stringify(author);
    return quotes;
  })
  .catch((err) => {
    console.log(`[Error]: ${err}`);
  })


  // explicitly return public methods when this object is instantiated
  return {
    quote: promisedQuote,
  };
})();

function swapQuotes(){
  return getQuote;
}
quoteButton.addEventListener('click', swapQuotes());
