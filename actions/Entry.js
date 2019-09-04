import _ from 'lodash';

const namespace = '@boilerplatejs/strapi/Entry';

const getDataType = () => ({
  error: null,
  content: null,
  count: 0,
  list: []
});

const data = {
  posts: getDataType(),
  collections: getDataType(),
  content: null
};

const stringifyParams = params => Object.keys(params).map(key => key + '=' + params[key]).join('&');

const call = (service, type, params = {}) => {
  const { id = '' } = params;
  service = service.toUpperCase();
  delete params.id;

  return {
    types: [`${namespace}/${type}/${service}`, `${namespace}/${type}/${service}_SUCCESS`, `${namespace}/${type}/${service}_ERROR`],
    promise: client => client.get(`/@boilerplatejs/strapi/Entry/${service.toLowerCase()}/${type}${service === 'load' && id ? `/${id}` : ''}?${stringifyParams(params)}`)
  };
}

export const load = (type, params) => call('load', type, params);
export const list = (type, params) => call('list', type, params);
export const count = (type) => call('count', type);

export default (state = data, action = {}) => {
  switch (action.type) {
    case `${namespace}/posts/LOAD_SUCCESS`:
      state.content = state.posts.content = action.result;
      break;
    case `${namespace}/posts/LIST_SUCCESS`:
      state.posts.list = _.unionBy(state.posts.list, action.result, post => post.id);
      break;
    case `${namespace}/posts/COUNT_SUCCESS`:
      state.posts.count = action.result;
      break;
    case `${namespace}/posts/LOAD_ERROR`:
      state.posts.error =  { ...new Error(), ...action.result };
      state.content = state.posts.content = null;
      break;
    case `${namespace}/posts/LIST_ERROR`:
      state.posts.error = new Error();
      break;
    case `${namespace}/posts/COUNT_ERROR`:
      state.posts.error = new Error();
      break;
    case `${namespace}/collections/LOAD_SUCCESS`:
      state.content = state.collections.content = action.result;
      break;
    case `${namespace}/collections/LIST_SUCCESS`:
      state.collections.list = _.unionBy(state.collections.list, action.result, collection => collection.id);
      break;
    case `${namespace}/collections/COUNT_SUCCESS`:
      state.collections.count = action.result;
      break;
    case `${namespace}/collections/LOAD_ERROR`:
      state.collections.error = { ...new Error(), ...action.result };
      state.content = state.collections.content = null;
      break;
    case `${namespace}/collections/LIST_ERROR`:
      state.collections.error = new Error();
      break;
    case `${namespace}/collections/COUNT_ERROR`:
      state.collections.error = new Error();
      break;
  }

  return state;
};
