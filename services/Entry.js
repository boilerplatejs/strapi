import Strapi from 'strapi-sdk-javascript';

const CONFIG_SERVICE = '/@boilerplatejs/core/Config/service?bundle=@boilerplatejs/strapi';
const RE_CACHE_KEY = /^.*Entry\/(.*)$/;

let cache = {};
let instance;

const getClient = async (req) => (instance = instance || new Strapi((await req.service.get(CONFIG_SERVICE)).host));

const getData = async (req, call) => {
    const key = req.url.replace(RE_CACHE_KEY, '$1');
    const useCache = (await req.service.get(CONFIG_SERVICE)).cache;
    const data = await (useCache && cache[key] || call());
    return useCache ? (cache[key] = cache[key] || data) : data;
};

const getEntry = async (req, params) => await getData(req, async () => {
    const id = params[1];
    return await (await getClient(req))[id ? 'getEntry' : 'getEntries'](params[0], id || req.query);
});

export const count = async (req, params) => await getData(req, async () => await (await getClient(req)).getEntryCount(params[0], req.query));

export const load = async (req, params) => {
    const entry = await getEntry(req, params);

    if (entry.length === 0) {
        throw { status: 404, ...new Error('Entry not found.') };
    }

    return entry.length ? entry[0] : entry;
};

export const list = async (req, params) => await getEntry(req, params);

export const refresh = async (req, params) => (cache = {});