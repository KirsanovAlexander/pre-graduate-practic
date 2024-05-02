import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import {AppProvider} from './AppContext';
import Preorders from './pages/preorders/preorders';
import Environments from './pages/environments/environments';
import EnvironmentDetails from './pages/environments/environmentDetails';
import Configurations from './pages/configurations/configurations';
import ConfigurationDetails from './pages/configurations/ConfigurationDetails';
import Datacenters from './pages/datacenters/datacenters';
import DatacenterDetails from './pages/datacenters/datacenterDetails';
import AppLayout from './AppLayout';
import PreorderDetails from './pages/preorders/PreorderDetails';

const routes = [
  {path: '/', exact: true, component: Preorders},
  {path: '/preorders', exact: true, component: Preorders},
  {path: '/preorders/:id', exact: true, component: PreorderDetails},
  {path: '/environments', exact: true, component: Environments},
  {path: '/environments/:id', exact: true, component: EnvironmentDetails},
  {path: '/configurations', exact: true, component: Configurations},
  {path: '/configurations/:id', exact: true, component: ConfigurationDetails},
  {path: '/datacenters', exact: true, component: Datacenters},
  {path: '/datacenters/:id', exact: true, component: DatacenterDetails},
];

function App() {
  return (
    <Router>
      <AppProvider>
        <div style={{display: 'flex'}}>
          <div style={{marginLeft: '20px'}}>
            <AppLayout>
              <Switch>
                {routes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    exact={route.exact}
                    component={route.component}
                  />
                ))}
              </Switch>
            </AppLayout>
          </div>
        </div>
      </AppProvider>
    </Router>
  );
}

export default App;
