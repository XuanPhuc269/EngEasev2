/**
 * Format date to readable Vietnamese format
 */
export const formatDate = (date: Date | string | undefined | null): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Format date with time
 */
export const formatDateTime = (date: Date | string | undefined | null): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  return d.toLocaleString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format relative time (e.g., "2 giờ trước")
 */
export const formatRelativeTime = (date: Date | string | undefined | null): string => {
  if (!date) return 'N/A';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid date';
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Vừa xong';
  if (diffMins < 60) return `${diffMins} phút trước`;
  if (diffHours < 24) return `${diffHours} giờ trước`;
  if (diffDays < 30) return `${diffDays} ngày trước`;
  return formatDate(d);
};

/**
 * Format duration in minutes to readable format
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes} phút`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
};

/**
 * Format duration in seconds to readable format
 */
export const formatDurationFromSeconds = (seconds: number): string => {
  if (seconds < 60) return `${seconds} giây`;
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  
  if (minutes < 60) {
    return secs > 0 ? `${minutes} phút ${secs} giây` : `${minutes} phút`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours} giờ ${mins} phút` : `${hours} giờ`;
};

/**
 * Format score/percentage
 */
export const formatScore = (score: number, total?: number): string => {
  if (total) {
    const percentage = (score / total) * 100;
    return `${score}/${total} (${percentage.toFixed(1)}%)`;
  }
  return score.toFixed(1);
};

/**
 * Format number with thousand separators
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('vi-VN');
};

export const formatters = {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatDuration,
  formatDurationFromSeconds,
  formatScore,
  formatNumber,
};