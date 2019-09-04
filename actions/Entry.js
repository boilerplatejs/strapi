const namespace = '@boilerplatejs/strapi/Entry';

const data = {
  posts: {
    error: null,
    content: null,
    count: 0,
    list: []
  },
  collections: {
    error: null,
    content: null,
    count: 0,
    list: []
  }
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
      state.posts.content = action.result;
    case `${namespace}/posts/LIST_SUCCESS`:
      state.posts.list = state.posts.list.concat(action.result);
    case `${namespace}/posts/COUNT_SUCCESS`:
      state.posts.count = action.result;
    case `${namespace}/posts/LOAD_ERROR`:
      state.posts.error = new Error();
    case `${namespace}/posts/LIST_ERROR`:
      state.posts.error = new Error();
    case `${namespace}/posts/COUNT_ERROR`:
      state.posts.error = new Error();
    case `${namespace}/collections/LOAD_SUCCESS`:
      state.collections.content = action.result;
    case `${namespace}/collections/LIST_SUCCESS`:
      state.collections.list = state.collections.list.concat(action.result);
    case `${namespace}/collections/COUNT_SUCCESS`:
      state.collections.count = action.result;
    case `${namespace}/collections/LOAD_ERROR`:
      state.collections.error = new Error();
    case `${namespace}/collections/LIST_ERROR`:
      state.collections.error = new Error();
    case `${namespace}/collections/COUNT_ERROR`:
      state.collections.error = new Error();
    default:
      return state;
  }
};
