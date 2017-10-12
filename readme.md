## deploy to heroku
> https://bo-github-issue-tracker.herokuapp.com

`git checkout heroku`



## how to run the project
`npm install` then `npm start`. open http://localhost:3000 

## use jest to test async code (like fetch)
greatest take-away being using snapshot with componentDidMount.
1. you need to mock `fetch` module
   1.1 in your test, declare `jest.mock('../common/fetch');`
   1.2 create a __mocks__ folder right next to the `./common/fetch.js` file
   1.3 create `__mocks__/fetch.js` with the same file name
   1.4 inside the mocked fetch.js, make sure you follow best practice (common sense prevail; like you must refer to original module as `../fetch`)
2. you need to mark your jest test as `async`
   1.2 `yarn add --dev babel-plugin-transform-async-to-generator`
   1.3 add `transform-async-to-generator` plugin to your `.babelrc`
   1.4 add `await Promise.resolve()` between `renderer.create(<IssueManager />)` and your assertions
