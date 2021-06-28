This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Introduction and Technology Used
This was a really fun project to build. The app allows you to see how much money you would have made dollar cost averaging into a cryptocurrency. Dollar cost averaging means investing the same amounnt of money into an asset over a period of time, such as investing $100 a month into Bitcoin for example.

I pulled the data from CoinGecko's free API. Building this project taught me alot about forms, manipulating API data, and number and date formatting.

On the home screen, the user can select and search for a cryptocurrency, as well as click on Info to pop open a modal (component taken from Material UI) for more information. They can specify the frequency, investment amount, and the specific dates.

The results screen shows the results of their investments (ROI, profit, etc.) as well as a comparison to if the user had instead just invested all the money all at once (lump sum). The user also has the option to download their investments in a spreadsheet.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.


### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

