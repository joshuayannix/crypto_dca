import { BrowserRouter, Route } from "react-router-dom";
import Home from './Home'
import Show from './Show';

function App() {
  return (
    <BrowserRouter>
      <div>
      <Route exact path="/" component={props => <Home {...props} />} />

      <Route path = '/show'>
        <Show />
      </Route>

      </div>
    </BrowserRouter>
    
  );
}

export default App;
