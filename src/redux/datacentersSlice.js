import {createSlice} from '@reduxjs/toolkit';
import {
  fetchDatacentersData,
  fetchFilteredDatacenters,
  createDatacenter,
  deleteDatacenter,
} from '../api';

const initialState = {
  data: [],
  loading: false,
  error: null,
  page: 1,
  pageSize: 5,
};

const datacentersSlice = createSlice({
  name: 'datacenters',
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
    createDatacenterStart(state) {
      state.loading = true;
      state.error = null;
    },
    createDatacenterSuccess(state, action) {
      state.loading = false;
      state.data.push(action.payload);
      state.createdDatacenterId = action.payload.id;
    },
    createDatacenterFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteDatacenterStart(state) {
      state.loading = true;
      state.error = null;
    },
    deleteDatacenterSuccess(state, action) {
      state.loading = false;
      state.data = state.data.filter((datacenter) => datacenter.id !== action.payload);
    },
    deleteDatacenterFailure(state, action) {
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
  createDatacenterStart,
  createDatacenterSuccess,
  createDatacenterFailure,
  deleteDatacenterStart,
  deleteDatacenterSuccess,
  deleteDatacenterFailure,
} = datacentersSlice.actions;

export const fetchDatacentersDataAsync = () => async (dispatch, getState) => {
  const {page, pageSize} = getState().datacenters;
  dispatch(fetchDataStart());
  try {
    const data = await fetchDatacentersData(page, pageSize);
    dispatch(fetchDataSuccess(data));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const fetchFilteredDatacentersAsync = (code) => async (dispatch, getState) => {
  const {page, pageSize} = getState().datacenters;
  dispatch(fetchDataStart());
  try {
    const filteredData = await fetchFilteredDatacenters(code, page, pageSize);
    dispatch(fetchDataSuccess(filteredData));
  } catch (error) {
    dispatch(fetchDataFailure(error.message));
  }
};

export const createDatacenterAsync = (data) => async (dispatch) => {
  dispatch(createDatacenterStart());
  try {
    const newDatacenter = await createDatacenter(data);
    dispatch(createDatacenterSuccess(newDatacenter));
  } catch (error) {
    dispatch(createDatacenterFailure(error.message));
  }
};

export const deleteDatacenterAsync = (id) => async (dispatch) => {
  dispatch(deleteDatacenterStart());
  try {
    await deleteDatacenter(id);
    dispatch(deleteDatacenterSuccess(id));
  } catch (error) {
    dispatch(deleteDatacenterFailure(error.message));
  }
};

export default datacentersSlice.reducer;
