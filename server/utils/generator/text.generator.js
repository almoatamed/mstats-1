const LoremIpsum = require("lorem-ipsum").LoremIpsum;

const config = {
  sentencesPerParagraph: {
    max: 8,
    min: 4
  },
  wordsPerSentence: {
    max: 16,
    min: 4
  },
}

const lorem = new LoremIpsum(config);

const types = {
  p: 'generateParagraphs',
  s: 'generateSentences',
  w: 'generateWords',
}

module.exports = function (n, type = 'p') {
  return lorem[types[type]](n);
}