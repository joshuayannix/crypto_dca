import { BrowserRouter, Route } from "react-router-dom";
import Home from './Home'
import Show from './Show';
import SavedSearches from './SavedSearches';

function App() {
  return (
    <BrowserRouter>
      <div>
      <Route exact path="/" component={props => <Home {...props} />} />

      <Route path = '/show'>
        <Show />
      </Route>

      <Route path = '/savedsearches'>
        <SavedSearches />
      </Route>

      </div>
    </BrowserRouter>
    
  );
}

export default App;
