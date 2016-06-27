const quoteButton = document.getElementById('quoteButton');
const quoteBoxContent = $('#quotebox--quote-js');
const quoteBoxAuthor = $('#quotebox--author-js');
// Revealing module pattern
const getQuote = (() => {

  const random = (min, max) => {
    const x = Math.floor(Math.random() * (max - min)) + min;
    return x;
  };

  const quote = new Object();

    function fetchQuote() {
      $.getJSON('/data/quotes.json', (data) => {
        const num = random(0, data.quotes.length);
        quote.author = data.quotes[num].author;
        quote.quote = data.quotes[num].quote;
        quoteBoxContent.html(JSON.stringify(quote.quote));
        quoteBoxAuthor.html(JSON.stringify(quote.author));
      });
      quoteBoxContent.text(JSON.stringify(quote.quote));
      quoteBoxAuthor.text(JSON.stringify(quote.author));
    };
    console.log(JSON.stringify(quote.author));

  // explicitly return public methods when this object is instantiated
  return {
    quote: fetchQuote,
  }

})();
quoteButton.addEventListener('click', getQuote.quote);
//  example usage
// getQuote.fetch(2, 10); // alerts "my method"
