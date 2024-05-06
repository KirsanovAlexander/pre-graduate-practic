import axios from 'axios';

const baseURL = 'http://localhost:3001';

const api = axios.create({
  baseURL,
});

export const fetchPreordersData = async ({
  environmentId,
  configurationId,
  datacenterIds,
  status,
  preorderType,
  isReplication,
  regNumber
}) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await api.get('/preorders', {
      params: {
        environmentId,
        configurationId,
        status,
        preorderType,
        regNumber,
        isReplication,
        datacenterIds: datacenterIds ? datacenterIds.join(',') : undefined,
      },
    });
    const configurations = await api.get('/configurations');
    const environments = await api.get('/environments');
    const datacenters = await api.get('/datacenters');
    const preorders = response.data.map((preorder) => ({
      ...preorder,
      configuration: configurations.data.find((conf) => conf.id === preorder.configurationId),
      environment: environments.data.find((env) => env.id === preorder.environmentId),
      datacenters: preorder.datacenterIds.map((datacenterId) =>
        datacenters.data.find((dc) => dc.id === datacenterId),
      ),
    }));
    return preorders;
  } catch (error) {
    throw new Error('Ошибка при получении данных предварительных заказов с сервера');
  }
};

export const fetchFilteredDatacenters = async (code, page = 1, pageSize = 10) => {
  try {
    const response = await api.get('/datacenters', {
      params: {code, _page: page, _limit: pageSize},
    });
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при поиске данных дата-центров на сервере');
  }
};

export const fetchFilteredConfigurations = async (code, page = 1, pageSize = 10) => {
  try {
    const response = await api.get('/configurations', {
      params: {code, _page: page, _limit: pageSize},
    });
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при поиске данных конфигураций на сервере');
  }
};

export const fetchFilteredEnvironments = async (code, page = 1, pageSize = 10) => {
  try {
    const response = await api.get('/environments', {
      params: {code, _page: page, _limit: pageSize},
    });
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при поиске данных сред на сервере');
  }
};

export const createDatacenter = async (data) => {
  try {
    const response = await api.post('/datacenters', data);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при создании дата-центра на сервере');
  }
};

export const createPreorder = async (data) => {
  try {
    const response = await api.post('/preorders', data);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при создании потребности на сервере');
  }
};

export const deleteDatacenter = async (id) => {
  try {
    await api.delete(`/datacenters/${id}`);
  } catch (error) {
    throw new Error('Ошибка при удалении дата-центра на сервере');
  }
};

export const deletePreorder = async (id) => {
  try {
    await api.delete(`/preorders/${id}`);
  } catch (error) {
    throw new Error('Ошибка при удалении дата-центра на сервере');
  }
};

export const createConfiguration = async (data) => {
  try {
    const response = await api.post('/datacenters', data);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при создании конфигурации на сервере');
  }
};

export const deleteConfiguration = async (id) => {
  try {
    await api.delete(`/datacenters/${id}`);
  } catch (error) {
    throw new Error('Ошибка при удалении конфигурации на сервере');
  }
};

export const createEnvironment = async (data) => {
  try {
    const response = await api.post('/environments', data);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при создании среды на сервере');
  }
};

export const deleteEnvironment = async (id) => {
  try {
    await api.delete(`/environments/${id}`);
  } catch (error) {
    throw new Error('Ошибка при удалении среды на сервере');
  }
};

export const fetchPreorderById = async (id) => {
  try {
    const response = await api.get(`/preorders/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных предварительного заказа с сервера');
  }
};

export const fetchDatacenterById = async (id) => {
  try {
    const response = await api.get(`/datacenters/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных дата-центра с сервера');
  }
};

export const fetchConfigurationById = async (id) => {
  try {
    const response = await api.get(`/configurations/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных конфигурации с сервера');
  }
};

export const fetchEnvironmentById = async (id) => {
  try {
    const response = await api.get(`/environments/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Ошибка при получении данных среды с сервера');
  }
};

export default api;
