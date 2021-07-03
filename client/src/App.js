import { BrowserRouter, Route } from "react-router-dom";
import Home from './Home'
import Show from './Show';
import Navbar from './Navbar';
import SavedSearches from './SavedSearches';

function App() {
  return (
    <BrowserRouter>
      <div>

        <Route exact path = '/'>
          <Navbar />
          <Home />
        </Route>

        <Route path = '/show'>
          <Navbar />
          <Show />
        </Route>

        <Route path = '/savedsearches'>
          <Navbar />
          <SavedSearches />
        </Route>

      </div>
    </BrowserRouter>
  );
}

export default App;
