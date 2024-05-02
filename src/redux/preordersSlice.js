import {createSlice} from '@reduxjs/toolkit';
import {
  fetchPreordersData, 
} from '../api';

const initialState = {
  data: [],
  configurations: [],
  environments: [],
  datacenters: [],
  loading: false,
  error: null,
};

const preorderSlice = createSlice({
  name: 'preorders',
  initialState,
  reducers: {
    fetchDataStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDataSuccess(state, action) {
      state.loading = false;
      state.data = action.payload;
    },
    fetchDataFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setConfigurations(state, action) {
      state.configurations = action.payload;
    },
    setEnvironments(state, action) {
      state.environments = action.payload;
    },
    setDatacenters(state, action) {
      state.datacenters = action.payload;
    },
  },
});

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  setConfigurations,
  setEnvironments,
  setDatacenters,
} = preorderSlice.actions;

export const fetchPreordersDataAsync = (filters) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const preorders = await fetchPreordersData(filters);
    dispatch(fetchDataSuccess(preorders));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export default preorderSlice.reducer;
