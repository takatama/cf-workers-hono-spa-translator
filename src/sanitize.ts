const MAX_LENGTH = 2048;

export function sanitize(input: string) {
  const sanitized = input
    // 不要な特殊文字を削除し、安全な文字列に変換
    .replace(/[^\p{L}\p{N}\s,.!?'"-]/gu, "")
    .slice(0, MAX_LENGTH);
  return sanitized;
}
