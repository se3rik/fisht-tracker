export type RequestOptions = Omit<RequestInit, 'body'> & {
    body?: unknown;
    _retry?: boolean;
};
