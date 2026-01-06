export function getDateGroup(date: Date | string): string {
  const now = new Date();
  const messageDate = typeof date === 'string' ? new Date(date) : date;
  const diffTime = now.getTime() - messageDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'Previous 7 Days';
  if (diffDays <= 30) return 'Previous 30 Days';
  return 'Older';
}

export function generateChatTitle(firstMessage: string): string {
  const maxLength = 50;
  const trimmed = firstMessage.trim();
  if (trimmed.length <= maxLength) return trimmed;
  return trimmed.slice(0, maxLength).trim() + '...';
}

