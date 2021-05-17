import { BrowserRouter, Route } from "react-router-dom";
import './App.css';
import Home from './Home'
import Show from './Show';

function App() {
  return (
    <BrowserRouter>
      <div>
      <Route exact path="/" component={props => <Home {...props} />} />

      <Route path = '/'>
        <Show />
      </Route>

      </div>
    </BrowserRouter>
    
  );
}

export default App;
