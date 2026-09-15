export function formatIDR(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(amount);
}

export function sanitizeAlphanumeric(text) {
    return text.replace(/[^a-zA-Z0-9\s]/g, '');
}

export function capitalizeWords(text) {
    return text
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

export function formatRelativeTime(timestamp) {
    if (!timestamp) return '';

    const rawTime = typeof timestamp === 'string' && timestamp.startsWith('session-')
        ? Number(timestamp.replace('session-', ''))
        : Number(timestamp);

    const date = new Date(rawTime);

    if (isNaN(date.getTime())) return '';

    const diffInSeconds = Math.floor((Date.now() - rawTime) / 1000);

    if (diffInSeconds < 60) {
        return 'Baru saja';
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
        return `${diffInMinutes} menit yang lalu`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
        return `${diffInHours} jam yang lalu`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
        return `${diffInDays} hari yang lalu`;
    }

    return date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short'
    });
}


export function formatDate(timestamp) {
    if (!timestamp) return '';

    const date = new Date(timestamp);

    const dateStr = date.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return `${dateStr}`;
}
