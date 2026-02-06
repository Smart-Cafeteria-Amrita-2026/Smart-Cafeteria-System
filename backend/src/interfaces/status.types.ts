export interface ServiceResponse<T> {
	success: boolean;
	data?: T;
	error?: string;
	statusCode: number;
}

export const STATUS = {
	SUCCESS: 200,
	CREATED: 201,
	ACCEPTED: 202,
	BADREQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOTFOUND: 404,
	TIMEOUT: 408,
	SERVERERROR: 500,
	BADGATEWAY: 502,
	SERVICEUNAVAILABLE: 503,
};
