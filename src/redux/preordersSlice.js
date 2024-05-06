import {createSlice} from '@reduxjs/toolkit';
import {
  fetchPreordersData, 
  createPreorder,
  deletePreorder,
  fetchFilteredConfigurations,
  fetchFilteredEnvironments,
  fetchFilteredDatacenters,
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
    createPreorderStart(state) {
      state.loading = true;
      state.error = null;
    },
    createPreorderSuccess(state, action) {
      state.loading = false;
      state.data.push(action.payload);
      state.createdPreorderId = action.payload.id;
    },
    createPreorderFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deletePreorderStart(state) {
      state.loading = true;
      state.error = null;
    },
    deletePreorderSuccess(state, action) {
      state.loading = false;
      state.data = state.data.filter((datacenter) => datacenter.id !== action.payload);
    },
    deletePreorderFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchConfigurationsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchConfigurationsSuccess(state, action) {
      state.loading = false;
      state.configurations = action.payload;
    },
    fetchConfigurationsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchDatacentersStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchDatacentersSuccess(state, action) {
      state.loading = false;
      state.datacenters = action.payload;
    },
    fetchDatacentersFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchEnvironmentsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchEnvironmentsSuccess(state, action) {
      state.loading = false;
      state.environments = action.payload;
    },
    fetchEnvironmentsFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
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
  createPreorderStart,
  createPreorderSuccess,
  createPreorderFailure,
  deletePreorderStart,
  deletePreorderSuccess,
  deletePreorderFailure,
  fetchConfigurationsStart,
  fetchConfigurationsSuccess,
  fetchConfigurationsFailure,
  fetchDatacentersStart,
  fetchDatacentersSuccess,
  fetchDatacentersFailure,
  fetchEnvironmentsStart,
  fetchEnvironmentsSuccess,
  fetchEnvironmentsFailure,
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

export const createPreorderAsync = (data) => async (dispatch) => {
  dispatch(createPreorderStart());
  try {
    const newPreorder = await createPreorder(data);
    dispatch(createPreorderSuccess(newPreorder));
  } catch (error) {
    dispatch(createPreorderFailure(error.message));
  }
};

export const deletePreorderAsync = (id) => async (dispatch) => {
  dispatch(deletePreorderStart());
  try {
    await deletePreorder(id);
    dispatch(deletePreorderSuccess(id));
  } catch (error) {
    dispatch(deletePreorderFailure(error.message));
  }
};

export const fetchConfigurationsAsync = () => async (dispatch) => {
  try {
    const configurations = await fetchFilteredConfigurations(); 
    dispatch(setConfigurations(configurations));
  } catch (error) {
  }
};

export const fetchDatacentersAsync = () => async (dispatch) => {
  try {
    const datacenters = await fetchFilteredDatacenters(); 
    dispatch(setDatacenters(datacenters));
  } catch (error) {
  }
};

export const fetchEnvironmentsAsync = () => async (dispatch) => {
  try {
    const environments = await fetchFilteredEnvironments(); 
    dispatch(setEnvironments(environments));
  } catch (error) {
  }
};

export default preorderSlice.reducer;
