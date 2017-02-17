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

  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // match any network
    },
    live: {
      host: "localhost",
      port: 8545,
      network_id: "*" // match any network
    }
  }
};
