/**
 * 防抖
 */
export function debounce(
  fn: (...args: any) => any | void,
  wait = 500
): (...args: any) => any {
  let timer: NodeJS.Timeout | null = null
  return function (this: any, ...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      return fn.apply(this, args)
    }, wait)
  }
}
