module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "bower_components/angular/angular.js",
      "bower_components/angular-route/angular-route.js",
      "javascripts/app.js",
      "javascripts/controllers/main.js",
      "javascripts/controllers/sendfunds.js",
      "javascripts/controllers/showevents.js",
      "javascripts/controllers/permissions.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/",
    "views/": "views/"
  },
  rpc: {
    host: "localhost",
    port: 8545,
    gas: 3550000
  }
};
