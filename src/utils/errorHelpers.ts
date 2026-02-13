
export function formatTimeToken(seconds: number): string {
    const now = new Date();
    const future = new Date(now.getTime() + seconds * 1000);

    return future.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
    });
}

export function parseErrorMessage(error: unknown): string {
    if (!error) return "";

    // 1. Handle string errors directly
    if (typeof error === 'string') {
        const friendlyMessage = translateTechnicalError(error);
        if (friendlyMessage) return friendlyMessage;

        if (error.trim().startsWith('{') && error.includes('detail')) {
            try {
                const parsed = JSON.parse(error);
                return parseErrorMessage(parsed);
            } catch (e) { }
        }

        const throttleMatch = error.match(/Expected available in (\d+) seconds/);
        if (throttleMatch && throttleMatch[1]) {
            const timeStr = formatTimeToken(parseInt(throttleMatch[1], 10));
            return `⏳ Registration limit reached. Please try again at ${timeStr}.`;
        }

        return error;
    }

    // 2. Handle native Error objects (can happen if thrown manually or from fetch logic)
    if (error instanceof Error) {
        const friendlyMessage = translateTechnicalError(error.message);
        if (friendlyMessage) return friendlyMessage;
        return error.message;
    }

    // 3. Handle object errors (API responses)
    if (typeof error === 'object' && error !== null) {
        const errObj = error as Record<string, any>;

        if (errObj.detail) {
            if (typeof errObj.detail === 'string') {
                const friendlyMessage = translateTechnicalError(errObj.detail);
                if (friendlyMessage) return friendlyMessage;

                const throttleMatch = errObj.detail.match(/Expected available in (\d+) seconds/);
                if (throttleMatch && throttleMatch[1]) {
                    const timeStr = formatTimeToken(parseInt(throttleMatch[1], 10));
                    return `⏳ Registration limit reached. Please try again at ${timeStr}.`;
                }
                return errObj.detail;
            }
            return String(errObj.detail);
        }

        if (errObj.error) {
            const msg = typeof errObj.error === 'string' ? errObj.error : JSON.stringify(errObj.error);
            const friendlyMessage = translateTechnicalError(msg);
            return friendlyMessage || msg;
        }

        if (errObj.message) {
            const msg = typeof errObj.message === 'string' ? errObj.message : JSON.stringify(errObj.message);
            const friendlyMessage = translateTechnicalError(msg);
            return friendlyMessage || msg;
        }

        if (errObj.non_field_errors) {
            const msg = Array.isArray(errObj.non_field_errors)
                ? errObj.non_field_errors[0]
                : String(errObj.non_field_errors);
            const friendlyMessage = translateTechnicalError(msg);
            return friendlyMessage || msg;
        }

        const keys = Object.keys(errObj);
        if (keys.length > 0) {
            const firstKey = keys[0];
            const val = errObj[firstKey];
            const msg = Array.isArray(val)
                ? val[0]
                : (typeof val === 'object' && val !== null)
                    ? JSON.stringify(val)
                    : String(val);
            const field = firstKey.charAt(0).toUpperCase() + firstKey.slice(1).replace(/_/g, ' ');
            return `${field}: ${msg}`;
        }
    }

    return "Something went wrong. Please check your data and try again.";
}

/**
 * Translate technical/backend error messages to user-friendly descriptions
 */
function translateTechnicalError(message: string): string | null {
    const lowerMsg = message.toLowerCase();

    // HTTP Status Code Errors
    if (lowerMsg.includes('413') || lowerMsg.includes('payload too large') || lowerMsg.includes('request entity too large')) {
        return "📁 File too large. Please use images or PDFs smaller than 4MB.";
    }
    if (lowerMsg.includes('500') || lowerMsg.includes('internal server error')) {
        return "🔧 Server error. Our team has been notified. Please try again in a few minutes.";
    }
    if (lowerMsg.includes('502') || lowerMsg.includes('bad gateway')) {
        return "🔧 Server is temporarily unavailable. Please try again in a moment.";
    }
    if (lowerMsg.includes('503') || lowerMsg.includes('service unavailable')) {
        return "🔧 Server is under maintenance. Please try again later.";
    }
    if (lowerMsg.includes('504') || lowerMsg.includes('gateway timeout')) {
        return "⏱️ Request timed out. The server is busy. Please try again.";
    }
    if (lowerMsg.includes('401') || lowerMsg.includes('unauthorized') || lowerMsg.includes('unauthenticated')) {
        return "🔐 Your session expired. Please log in again.";
    }
    if (lowerMsg.includes('403') || lowerMsg.includes('forbidden')) {
        return "🚫 Access denied. You don't have permission for this action.";
    }
    if (lowerMsg.includes('404') || lowerMsg.includes('not found')) {
        return "🔍 Resource not found. Please refresh the page.";
    }

    // Network/Connection Errors
    if (lowerMsg.includes('failed to fetch') || lowerMsg.includes('network') || lowerMsg.includes('connection')) {
        return "📶 Network error. Please check your internet connection and try again.";
    }
    if (lowerMsg.includes('timeout') || lowerMsg.includes('timed out')) {
        return "⏱️ Request timed out. Please try again.";
    }
    if (lowerMsg.includes('abort')) {
        return "⏱️ Request was cancelled. Please try again.";
    }

    // Database/Backend Specific
    if (lowerMsg.includes('unique constraint') || lowerMsg.includes('already exists') || lowerMsg.includes('duplicate')) {
        return "⚠️ This information is already registered. Please check your entries.";
    }
    if (lowerMsg.includes('unexpected end of json')) {
        return "🔧 Server returned an incomplete response. Please try again.";
    }

    return null; // No translation found, use original
}

