import {createSlice} from '@reduxjs/toolkit';
import {
  fetchEnvironmentsData,
  fetchFilteredEnvironments,
  createEnvironment,
  deleteEnvironment,
} from '../api';

const initialState = {
  data: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 5,
};

const environmentsSlice = createSlice({
  name: 'environments',
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
    createEnvironmentStart(state) {
      state.loading = true;
      state.error = null;
    },
    createEnvironmentSuccess(state, action) {
      state.loading = false;
      state.data.push(action.payload);
      state.createdDatacenterId = action.payload.id;
    },
    createEnvironmentFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteEnvironmentStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteEnvironmentSuccess(state, action) {
      state.loading = false;
      state.data = state.data.filter((environment) => environment.id !== action.payload);
    },
    deleteEnvironmentFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchDataStart,
  fetchDataSuccess,
  fetchDataFailure,
  setPage,
  createEnvironmentStart,
  createEnvironmentSuccess,
  createEnvironmentFailure,
  deleteEnvironmentStart,
  deleteEnvironmentSuccess,
  deleteEnvironmentFailure,
} = environmentsSlice.actions;

export const fetchEnvironmentsDataAsync = () => async (dispatch, getState) => {
  const {page, pageSize} = getState().environments;
  dispatch(fetchDataStart());
  try {
    const data = await fetchEnvironmentsData(page, pageSize);
    dispatch(fetchDataSuccess(data));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const fetchFilteredEnvironmentsAsync = (code) => async (dispatch, getState) => {
  const {page, pageSize} = getState().environments;
  dispatch(fetchDataStart());
  try {
    const filteredData = await fetchFilteredEnvironments(code, page, pageSize);
    dispatch(fetchDataSuccess(filteredData));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const createEnvironmentAsync = (data) => async (dispatch) => {
  dispatch(createEnvironmentStart());
  try {
    const newDatacenter = await createEnvironment(data);
    dispatch(createEnvironmentSuccess(newDatacenter));
  } catch (error) {
    dispatch(createEnvironmentFailure(error.message));
  }
};

export const deleteEnvironmentAsync = (id) => async (dispatch) => {
  dispatch(deleteEnvironmentStart());
  try {
    await deleteEnvironment(id);
    dispatch(deleteEnvironmentSuccess(id));
  } catch (error) {
    dispatch(deleteEnvironmentFailure(error.message));
  }
};

export default environmentsSlice.reducer;
