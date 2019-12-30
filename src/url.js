const URL_SEPERATOR = "/";
const HASH_SEPERATOR = "#";
const QUERY_SEPERATOR = "?";
const FILE_SEPERATOR = ".";
const PROTOCOL_SEPERATOR = ":";
const EXTERNAL_KEYS = [ "http", "https" ];

class Url {

	constructor(url, options={
		protocal: "http",
		host: "localhost"
	}) {
		this.url = Url.getUrl(url);
		this.protocal = Url.getProtocol(url, options.protocal);
		this.host = Url.getHost(url, options.host);
		this.route = Url.getUrl(url);
		this.query = Url.getQuery(url);
		this.hash = Url.getHash(url);
		this.fullUrl = Url.getFullUrl(this.protocal, this.host, this.route, this.query, this.hash);
		this.uniqueUrl = Url.getUniqueUrl(this.protocal, this.host, this.route, this.query);
	}


	static getUniqueUrl(protocal, host, route="", query="") {
		if (typeof protocal !== "string" || typeof host !== "string" || typeof route !== "string" || typeof query !== "string") 
			throw new Error("Input must be strings");
		return `${protocal}://${host}${route.length > 0 && route[0] !== "/" && host[host.length -1] !== "/" ? "/" : ""}${route.length > 0 ? route : ""}${query.length > 0 ? "?" + query : ""}`
	}

	static getFullUrl(protocal, host, route="", query="", hash="") {
		if (typeof protocal !== "string" || typeof host !== "string" || typeof route !== "string" || typeof query !== "string" || typeof hash !== "string" ) 
			throw new Error("Input must be strings");
		return `${Url.getUniqueUrl(protocal, host, route, query)}${hash.length > 0 ? "#" + hash : ""}`
	}

	static splitUrl(url) {
		return Url
			.getUrl(url)
			.split(URL_SEPERATOR)
			.filter(str => str !== null && str.length > 0);
	}

	static getProtocol(url, defaultProtocal="") {
		if (typeof url !== "string") throw new Error("url must be string");
		const protocalIndex = url.indexOf(PROTOCOL_SEPERATOR);
		return (protocalIndex <= 0) ? defaultProtocal : url.substring(0, protocalIndex).toLowerCase();

	}

	static hasProtocal(url) {
		return Url.getProtocol(url).length > 0;
	}

	static getUrl(url) {
		if (typeof url !== "string") throw new Error("url must be string");
		const hashIndex = url.indexOf(HASH_SEPERATOR);
		const queryIndex = url.indexOf(QUERY_SEPERATOR);
		const arr = [ hashIndex, queryIndex ].filter(idx => idx >= 0);
		return (arr.length === 0) 
			? url.toLowerCase() 
			: url.substring(0, Math.min(...arr)).toLowerCase();
	}

	static getRoute(url) {
		const split = Url.splitUrl(url);
		const start = Url.hasProtocal(url) ? 2 : 0;
		return split.splice(start).join("/");
	}

	static getHost(url, defaultHost="") {
		return Url.hasProtocal(url) ? Url.splitUrl(url)[1] : defaultHost;
	}

	static getQuery(url, defaultQuery="") {
		if (typeof url !== "string") throw new Error("url must be string");
		const queryIndex = url.indexOf(QUERY_SEPERATOR);
		const hashIndex = url.indexOf(HASH_SEPERATOR);
		return queryIndex < 0
			? defaultQuery 
			: url.substring(queryIndex +1 , hashIndex < 0 ? url.length : hashIndex);
	}

	static getHash(url, defaultHash="") {
		if (typeof url !== "string") throw new Error("url must be string");
		const hashIndex = url.indexOf(HASH_SEPERATOR);
		return hashIndex < 0 ? defaultHash : url.substring(hashIndex + 1);
	}

	static getFactory(options) {
		return function(url) {
			return new Url(url, options);
		};
	}

}

module.exports = Url;