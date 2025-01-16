export const http = {
	/**
	 * Realizar petición GET
	 */
	get: <Response>(
		url: string,
		config?: Omit<ServerFetchConfig, 'body'>
	) => serverFetch<Response>('GET', url, config),

	/**
	 * Realizar petición POST
	 */
	post: <Response, ReqBody = any>(
		url: string,
		body?: ReqBody,
		config?: Omit<ServerFetchConfig, 'body'>
	) => serverFetch<Response, ReqBody>('POST', url, { ...config, body }),

	/**
	 * Realizar petición PUT
	 */
	put: <Response, ReqBody = any>(
		url: string,
		body?: ReqBody,
		config?: Omit<ServerFetchConfig, 'body'>
	) => serverFetch<Response, ReqBody>('PUT', url, { ...config, body }),

	/**
	 * Realizar petición DELETE
	 */
	delete: <Response>(
		url: string,
		config?: ServerFetchConfig
	) => serverFetch<Response>('DELETE', url, config),

	/**
	 * Realizar petición PATCH
	 */
	patch: <Response, ReqBody = any>(
		url: string,
		body?: ReqBody,
		config?: Omit<ServerFetchConfig, 'body'>
	) => serverFetch<Response, ReqBody>('PATCH', url, { ...config, body }),
};
