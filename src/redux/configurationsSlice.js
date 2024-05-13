import {createSlice} from '@reduxjs/toolkit';
import {
  fetchFilteredConfigurations,
  createConfiguration,
  deleteConfiguration,
} from '../api';

const initialState = {
  data: [],
  loading: false,
  error: null,
  page: 1,
  perPage: 10,
};

const configurationsSlice = createSlice({
  name: 'configurations',
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
    setPage(state, action) {
      state.page = action.payload;
    },
    createConfigurationStart(state) {
      state.loading = true;
      state.error = null;
    },
    createConfigurationSuccess(state, action) {
      state.loading = false;
      state.data.push(action.payload);
      state.createdConfigurationId = action.payload.id;
    },
    createConfigurationFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteConfigurationStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteConfigurationSuccess(state, action) {
      state.loading = false;
      state.data = state.data.filter((сonfiguration) => сonfiguration.id !== action.payload);
    },
    deleteConfigurationFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    setPerPage(state, action) {
      state.perPage = action.payload;
    },
  },
});

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  setPage,
  createConfigurationStart,
  createConfigurationSuccess,
  createConfigurationFailure,
  deleteConfigurationStart,
  deleteConfigurationSuccess,
  deleteConfigurationFailure,
  setPerPage,
} = configurationsSlice.actions;

export const fetchFilteredConfigurationsAsync = (params) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const configurations = await fetchFilteredConfigurations(params);
    dispatch(fetchDataSuccess(configurations));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const createConfigurationAsync = (data) => async (dispatch) => {
  dispatch(createConfigurationStart());
  try {
    const newConfiguration = await createConfiguration(data);
    dispatch(createConfigurationSuccess(newConfiguration));
  } catch (error) {
    dispatch(createConfigurationFailure(error.message));
  }
};

export const deleteConfigurationAsync = (id) => async (dispatch) => {
  dispatch(deleteConfigurationStart());
  try {
    await deleteConfiguration(id);
    dispatch(deleteConfigurationSuccess(id));
  } catch (error) {
    dispatch(deleteConfigurationFailure(error.message));
  }
};

export default configurationsSlice.reducer;
