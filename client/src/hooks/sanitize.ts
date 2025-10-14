import DOMPurify from 'dompurify';

// Sanitize input to prevent HTML, XSS, and JS injection
export const sanitizeInput = (input: string) => {
    if (!input) return '';

    // Sanitize using DOMPurify (removes scripts, HTML elements, and dangerous attributes)
    const sanitized = DOMPurify.sanitize(input);

    // You can apply additional sanitization if necessary, such as removing SQL injection patterns
    return preventSQLInjection(sanitized);
};

// Prevent SQL injection patterns in the input (basic approach)
const preventSQLInjection = (input: string) => {
    const sqlInjectionPatterns = [
        /(\%27)|(\')|(\-\-)|(\%23)|(#)/gi, // Prevents single quotes, comments, and hash symbols
        /\b(SELECT|INSERT|DELETE|UPDATE|DROP|UNION|HAVING|WHERE|FROM|OR|AND|LIMIT|NULL|LIKE|--)\b/gi, // Detects common SQL keywords
    ];

    // Replace any SQL injection patterns found with an empty string
    return sqlInjectionPatterns.reduce((acc, regex) => acc.replace(regex, ''), input);
};

// Special function for validating specific types of inputs like emails, URLs, and numbers
export const validateInput = (input: string, type: 'email' | 'url' | 'number' | 'text' = 'text') => {
    if (!input) return false;

    // Validate email format using a simple regex
    if (type === 'email') {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(input);
    }

    // Validate URL format using a simple regex
    if (type === 'url') {
        const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
        return urlRegex.test(input);
    }

    // Validate numeric input (can be adjusted for specific cases like integers, decimals)
    if (type === 'number') {
        const numberRegex = /^[0-9]+(\.[0-9]+)?$/;
        return numberRegex.test(input);
    }

    // If it's a general text input, simply sanitize it
    return sanitizeInput(input);
};

// Preventing dangerous characters for certain input types
export const preventSpecialCharacters = (input: string, allowedCharacters: string[] = []) => {
    // List of disallowed characters
    const disallowedChars = ['<', '>', '/', '\\', '"', "'", ';', '%', '`', '{', '}', '|', '&'];

    // Remove characters that are not in the allowed list
    const regex = new RegExp(`[^a-zA-Z0-9${allowedCharacters.join('')} ]`, 'g');
    return input.replace(regex, '');
};

// Example of using this utility for sanitizing input fields globally

// Usage in React component
export const handleInputSanitization = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    // Sanitize input using the global sanitize function
    const sanitizedValue = sanitizeInput(inputValue);

    // Then set the sanitized value into the component state
    if (e.target.type === 'text') {
        // Set the sanitized input to your state
    } else if (e.target.tagName === 'TEXTAREA') {
        // Set the sanitized text area value to your state
    }
};
