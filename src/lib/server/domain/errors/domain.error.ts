export class DomainError extends Error {
    constructor(message: string, public readonly code: string = 'DOMAIN_ERROR') {
        super(message);
        this.name = 'DomainError';
    }
}

export class ResourceNotFoundError extends DomainError {
    constructor(resource: string) {
        super(`${resource} not found`, 'NOT_FOUND');
        this.name = 'ResourceNotFoundError';
    }
}

export class ValidationError extends DomainError {
    constructor(message: string) {
        super(message, 'VALIDATION_ERROR');
        this.name = 'ValidationError';
    }
}
