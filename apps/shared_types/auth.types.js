"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VALIDATION_RULES = void 0;
exports.VALIDATION_RULES = {
    EMAIL: {
        REGEX: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        MAX_LENGTH: 254,
    },
    FULL_NAME: {
        MIN_LENGTH: 2,
        MAX_LENGTH: 50,
        REGEX: /^[a-zA-ZÀ-ÿ\s'-]+$/,
    },
    PASSWORD: {
        MIN_LENGTH: 8,
        MAX_LENGTH: 128,
        REGEX: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    },
};
//# sourceMappingURL=auth.types.js.map