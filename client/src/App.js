import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import './App.css';

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

// Views
import Home from './views/home/Home';
import Schilderijen from './views/schilderijen/Schilderijen';
import SchilderijDetails from './views/schilderijDetails/SchilderijDetails';
import Schilders from './views/schilders/Schilders';
import SchilderDetails from './views/schilderDetails/SchilderDetails';
import Search from './views/search/Search';
import Contact from './views/contact/Contact';
import FAQ from './views/faq/FAQ';
import Login from './views/login/Login';
import Registreren from './views/registreren/Registreren';
import NoMatch from './views/404/404';

// Components
import Header from './components/header/Header';
import Footer from './components/footer/Footer';

const client = new ApolloClient({
  uri: 'http://localhost:3001/graphql'
})

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ApolloProvider client={client}>
        <Router>
          <div className="App">
            <Header />
            <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/schilderijen" component={Schilderijen}/>
              <Route path="/schilderij/:id" component={SchilderijDetails}/>
              <Route path="/schilders" component={Schilders}/>
              <Route path="/schilder/:id" component={SchilderDetails}/>
              <Route path="/zoeken" component={Search} />
              <Route path="/contact" component={Contact} />
              <Route path="/faq" component={FAQ} />
              <Route path="/login" component={Login} />
              <Route path="/registreren" component={Registreren} />
              <Route component={NoMatch} />
            </Switch>
            <Footer/>
          </div>
        </Router>
      </ApolloProvider>
    );
  }
}

export default App;
