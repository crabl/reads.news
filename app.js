const express = require('express');
const wildcardSubdomains = require('wildcard-subdomains');
const validator = require('validator');
const path = require('path');
const bodyParser = require('body-parser');
const getUrls = require('get-urls');

const app = express();

app.use(bodyParser.json());

app.use(wildcardSubdomains({
  whitelist: ['www', 'app', 'api'],
}));

const db = {
  'chris': [
    'https://medium.com/data-from-the-trenches/predicting-crime-in-portland-oregon-184453cccd5b',
    'https://www.codementor.io/vladimirgorej/folding-promises-in-javascript-b1l7mwh93',
    'http://franchise.cloud',
    'http://www.core-econ.org/the-economy/book/text/0-3-contents.html'
  ],

  'mike': [
    'https://www.bloomberg.com/news/articles/2017-09-21/hewlett-packard-enterprise-is-said-to-plan-about-5-000-job-cuts',
    'https://www.wsj.com/articles/apple-watch-series-3-review-untethered-and-unreliable-1505905203?cx_testId=17&cx_testVariant=cx&cx_artPos=0&cx_tag=personal?cx_campaign=poptart&mod=cx_poptart#cxrecs_s',
    'http://www.cbc.ca/beta/news/canada/calgary/amazon-todd-hirsch-arts-culture-imperative-calgary-1.4304875'
  ]
}

app.get('/_sub/:subdomain/reader.js', function (req, res) {
  res.sendFile(path.join(__dirname + '/public/reader.js'));
});

app.get('/_sub/:subdomain/', function (req, res) {
  const raw_subdomain = req.params.subdomain;

  if (!validator.isAlphanumeric(raw_subdomain)) {
    return res.json({ fuck: 'you' });
  }

  const subdomain = raw_subdomain.toLowerCase();

  // route to retrive based on subdomain
  const links = db[subdomain]; // just test to see if user exists, SPA will get the content

  if (links) {
    return res.sendFile(path.join(__dirname + '/public/user.html'));
  }

  return res.sendFile(path.join(__dirname + '/public/404.html'));
});

app.get('/_sub/:subdomain/links', function (req, res) {
  const raw_subdomain = req.params.subdomain;

  if (!validator.isAlphanumeric(raw_subdomain)) {
    return res.json({ fuck: 'you' });
  }

  const subdomain = raw_subdomain.toLowerCase();

  // route to retrive based on subdomain
  const links = db[subdomain]; // just test to see if user exists, SPA will get the content

  if (links) {
    return res.json(links);
  }

  return res.json([]);
});

app.post('/_sub/:subdomain/preview', function (req, res) {
  return res.send('ayy');
});

app.post('/webhook', function (req, res) {
  const { To, From, FromName, TextBody } = req.body;

  const user = To.replace('@reads.news', '');
  const urls = Array.from(getUrls(TextBody));

  db[user] = [...db[user], ...urls];

  res.send('OK');
});

app.listen(process.env.PORT || 3000);
