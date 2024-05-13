import configurationsReducer, {
  fetchFilteredConfigurationsAsync,
  createConfigurationAsync,
  deleteConfigurationAsync,
} from './configurationsSlice';

import datacentersReducer, {
  fetchFilteredDatacentersAsync,
  createDatacenterAsync,
  deleteDatacenterAsync,
} from './datacentersSlice';

import environmentsReducer, {
  fetchFilteredEnvironmentsAsync,
  createEnvironmentAsync,
  deleteEnvironmentAsync,
} from './environmentsSlice';

import preordersReducer, {
  fetchPreordersDataAsync,
  createPreorderAsync,
  deletePreorderAsync,
  fetchConfigurationsAsync,
  fetchDatacentersAsync,
  fetchEnvironmentsAsync,
} from './preordersSlice';

import store from './store';

export {
  configurationsReducer,
  fetchFilteredConfigurationsAsync,
  createConfigurationAsync,
  deleteConfigurationAsync,
  datacentersReducer,
  fetchFilteredDatacentersAsync,
  createDatacenterAsync,
  deleteDatacenterAsync,
  environmentsReducer,
  fetchFilteredEnvironmentsAsync,
  createEnvironmentAsync,
  deleteEnvironmentAsync,
  preordersReducer,
  fetchPreordersDataAsync,
  createPreorderAsync,
  deletePreorderAsync,
  fetchConfigurationsAsync,
  fetchDatacentersAsync,
  fetchEnvironmentsAsync,
  store,
};
