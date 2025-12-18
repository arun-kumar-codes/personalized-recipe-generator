import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/recipes" component={Recipes} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;