import {configureStore} from '@reduxjs/toolkit';
import environmentsReducer from './environmentsSlice'; 
import configurationsReducer from './configurationsSlice';
import datacentersReducer from './datacentersSlice';
import preordersReducer from './preordersSlice';

export default configureStore({
  reducer: {
    preorders: preordersReducer,
    environments: environmentsReducer,
    configurations: configurationsReducer,
    datacenters: datacentersReducer,
  },
});
