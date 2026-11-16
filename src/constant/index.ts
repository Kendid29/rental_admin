// Accept multiple env var names to match backend/system naming
const rawApiUrl =
	process.env.NEXT_PUBLIC_API_URL || process.env.url || process.env.URL || process.env.API_URL || '';
const rawApiVersion =
	process.env.NEXT_PUBLIC_API_VERSION || process.env['api-version'] || process.env.API_VERSION || '';

const rawClientVersion =
	process.env.NEXT_PUBLIC_CLIENT_VERSION || process.env['x-client-version'] || process.env.X_CLIENT_VERSION || '';

const rawDevBearerToken =
	process.env.NEXT_PUBLIC_DEV_BEARER_TOKEN || process.env.bearer_token || process.env.BEARER_TOKEN || '';

const useMockRaw = process.env.NEXT_PUBLIC_USE_MOCK_API || process.env.USE_MOCK_API || '';

const normalizedApiUrl = rawApiUrl.endsWith('/') ? rawApiUrl.slice(0, -1) : rawApiUrl;
const normalizedApiVersion = rawApiVersion ? `/${rawApiVersion.replace(/^\/+|\/+$/g, '')}` : '/api/v1';

export const apiOrigin = normalizedApiUrl;
export const baseURL = normalizedApiVersion;
export const clientVersion = rawClientVersion;
export const devBearerToken = rawDevBearerToken;
export const useMockApi = useMockRaw === 'true' || useMockRaw === '1' || false;
export const maxFileSize = Number(process.env.NEXT_PUBLIC_MAX_FILE_UPLOAD_SIZE || 2);
export const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || process.env.NODE_ENV || 'production';
