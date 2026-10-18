export function optimizedImageUrl(url: string): string {
  return url.replace(/^\/images\/([^?#]+)\.jpg(?=([?#]|$))/i, '/images/$1.webp');
}
