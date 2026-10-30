export function clampToRange(value: number, minPos: number, maxPos: number): number {
  return Math.min(Math.max(value, minPos), maxPos)
}
