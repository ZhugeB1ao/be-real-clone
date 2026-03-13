
export const formatTimeAgo = (createAt: string): string => {
    const now = new Date()
    const created = new Date(createAt)
    const diff = now.getTime() - created.getTime()

    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes} m${minutes > 1 ? "s" : ""} ago`
    if (hours < 24) return `${hours} h${hours > 1 ? "s" : ""} ago`

    return `${Math.floor(hours / 24)}d ago`
};

export const formatTimeRemaining = (expiresAt: string): string => {
  const now = new Date();
  const expires = new Date(expiresAt);
  const diff = expires.getTime() - now.getTime();

  if (diff <= 0) return "Expired";

  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  return `${minutes}m left`;
};

