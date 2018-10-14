# Web Crawler

This is simple web crawler, which does take the snapshot and write html page to a file.

## Prerequisites
* [Node.js](https://nodejs.org)
* [nvm](https://github.com/creationix/nvm) or version of node compatible with version in .nvmrc


###TODO

``` sh
* Used regex to generate html pages, but we can use query selector to do that.
* Need to scrawl pages for child of child as well. As of parent and its child only covered.
* Adding a threshold while writing a file in promise to memory issues.
* Create a date folder while writing the files
* Add unit tests for Crawler file
* Add code coverege and publish all files links to a page to open it beautifully
* Error handling while writing files
```


### Running Locally
Run once:

```sh
$ git@github.com:prabhay759/web-crawler.git
$ cd web-crawler
$ npm install
```
To generate screenshots of home page links on https://www.voot.com run npm start.

```sh
$ npm start
```

Use Ctrl+C to stop it.

### Running Unit Tests

```sh
$ npm test
```

To run automatic fixes of scode style:

``` sh
npm run style:fix
```

## More info

[Prabhay Contact] (guptaprabhay@yahoo.com)
