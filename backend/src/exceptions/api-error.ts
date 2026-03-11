class ApiError extends Error {
    status: number;
    errors: unknown[];

    constructor(status: number, message: string, errors: unknown[] = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError() {
        return new ApiError(401, 'Пользователь не авторизирован');
    }

    static BadRequest(message: string, errors: unknown[] = []) {
        return new ApiError(400, message, errors);
    }

    static Forbidden() {
        return new ApiError(403, 'Нет доступа');
    }
}

export default ApiError;
