export function fmtRM(n: number | null | undefined): string {
  if (n == null) return '';
  if (n === 0) return 'Complimentary';
  return 'RM ' + n.toLocaleString('en-MY');
}
