import {createSlice} from '@reduxjs/toolkit';
import {
  fetchFilteredEnvironments,
  createEnvironment,
  deleteEnvironment,
} from '../api';

const initialState = {
  data: [],
  loading: false,
  error: null,
  page: 1,
  perPage: 10,
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
      state.createdEnvironmentId = action.payload.id;
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
    updateEnvironmentDescription(state, action) {
      const {id, description} = action.payload;
      const environmentToUpdate = state.data.find(env => env.id === id);
      if (environmentToUpdate) {
        environmentToUpdate.description = description;
      }
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
  createEnvironmentStart,
  createEnvironmentSuccess,
  createEnvironmentFailure,
  deleteEnvironmentStart,
  deleteEnvironmentSuccess,
  deleteEnvironmentFailure,
  updateEnvironmentDescription,
  setPerPage,
} = environmentsSlice.actions;

export const fetchFilteredEnvironmentsAsync = (params) => async (dispatch) => {
  dispatch(fetchDataStart());
  try {
    const environments = await fetchFilteredEnvironments(params);
    dispatch(fetchDataSuccess(environments));
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
