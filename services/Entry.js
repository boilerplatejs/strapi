import Strapi from 'strapi-sdk-javascript';

const RE_CACHE_KEY = /^.*Entry\/(.*)$/;

let cache = {};
let instance;

const getClient = async (req) => (instance = instance || new Strapi((await req.service.get(`/@boilerplatejs/core/Config/service?bundle=@boilerplatejs/strapi`)).host));

const getEntry = async (req, params) => {
    const type = params[0], id = params[1], key = req.url.replace(RE_CACHE_KEY, '$1');
    return (cache[key] = cache[key] || await (await getClient(req))[id ? 'getEntry' : 'getEntries'](type, id || req.query));
};

export const count = async (req, params) => {
    const type = params[0], key = req.url.replace(RE_CACHE_KEY, '$1');
    return (cache[key] = cache[key] || await (await getClient(req)).getEntryCount(type, req.query));
};

export const load = async (req, params) => {
    const entry = await getEntry(req, params);

    if (entry.length === 0) {
        throw { status: 404, ...new Error('Entry not found.') };
    }

    return entry.length ? entry[0] : entry;
};

export const list = async (req, params) => await getEntry(req, params);

export const refresh = async (req, params) => (cache = {});