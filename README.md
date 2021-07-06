This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Introduction and Technology Used

This is the front end repo for a full-stack MERN app (MongoDB, Express, React, Node). Link to backend repo here: https://github.com/joshuayannix/backend_cryptodca

This was a really fun project to build. The app allows you to see how much money you would have made dollar cost averaging into a cryptocurrency. Dollar cost averaging means investing the same amounnt of money into an asset over a period of time, such as investing $100 a month into Bitcoin for example.

I pulled the data from CoinGecko's free API. Building this project taught me alot about forms, manipulating API data, and number and date formatting.

Features:
- After a user runs a search, they can save it (making request to DB). Searches are saved on a MongoDB database. User can also view a history of saved searches, and run those searches from that page. They can also delete searches (another DB request), with real-time updates.
- Added Pusher.js extension to the backend to allow for real-time database updates. So when a user saves a new search (sending query to MongoDB), Pusher sends a message back from MongoDB to front end, so we instantly see the number of saved searches increase in the notification bell at the top.
- Google user authentication from Firebase, with Redux for state management
- Material UI modal for more info, as well as date and calendar inputs
- The results screen shows the results of their investments (ROI, profit, etc.) as well as a comparison to if the user had instead just invested all the money all at once (lump sum). 
- I used a react table library to allow the user to download their investments in a spreadsheet.
- Form validations (dates can't be in the future, end must be after start, amount can't be negative, need to select a crpto, start and end date can't be the same)


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

