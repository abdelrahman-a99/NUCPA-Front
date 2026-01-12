
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
        // Check for JSON string "{\"detail\":...}"
        if (error.trim().startsWith('{') && error.includes('detail')) {
            try {
                const parsed = JSON.parse(error);
                return parseErrorMessage(parsed);
            } catch (e) {
                // Not valid JSON, treat as plain text
            }
        }

        // Check for specific throttle message pattern in the string itself
        // e.g. "Request was throttled. Expected available in 2838 seconds."
        const throttleMatch = error.match(/Expected available in (\d+) seconds/);
        if (throttleMatch && throttleMatch[1]) {
            const timeStr = formatTimeToken(parseInt(throttleMatch[1], 10));
            return `⏳ Limit reached. Please try again at ${timeStr}.`;
        }

        return error;
    }

    // 2. Handle object errors (API responses)
    if (typeof error === 'object') {
        const errObj = error as Record<string, any>;

        // Django DRF standard validation error: { detail: "..." }
        if (errObj.detail) {
            if (typeof errObj.detail === 'string') {
                const throttleMatch = errObj.detail.match(/Expected available in (\d+) seconds/);
                if (throttleMatch && throttleMatch[1]) {
                    const timeStr = formatTimeToken(parseInt(throttleMatch[1], 10));
                    return `⏳ Limit reached. Please try again at ${timeStr}.`;
                }
                return errObj.detail;
            }
            return String(errObj.detail);
        }

        // Standard "error" field
        if (errObj.error) {
            return typeof errObj.error === 'string' ? errObj.error : JSON.stringify(errObj.error);
        }

        // "message" field (common in generic APIs)
        if (errObj.message) {
            return typeof errObj.message === 'string' ? errObj.message : JSON.stringify(errObj.message);
        }

        // Non-field errors (Django)
        if (errObj.non_field_errors) {
            return Array.isArray(errObj.non_field_errors)
                ? errObj.non_field_errors[0]
                : String(errObj.non_field_errors);
        }

        // If it has random keys (field errors), try to join them or show the first one
        const keys = Object.keys(errObj);
        if (keys.length > 0) {
            // Just take the first error for simplicity in a toast/alert
            const firstKey = keys[0];
            const val = errObj[firstKey];
            const msg = Array.isArray(val) ? val[0] : String(val);
            // Capitalize field name
            const field = firstKey.charAt(0).toUpperCase() + firstKey.slice(1).replace(/_/g, ' ');
            return `${field}: ${msg}`;
        }
    }

    return "An unexpected error occurred.";
}
