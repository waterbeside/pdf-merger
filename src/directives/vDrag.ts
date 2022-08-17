export default {
  mounted(el: HTMLElement, binding: any) {
    const handle = binding.value
    let isDown = false,
      baseX = 0,
      baseY = 0
    
    el.addEventListener('mousedown', (e: MouseEvent) => {
      isDown = true
      baseX = e.x
      baseY = e.y
      document.onmousemove = (e: MouseEvent) => {
        if (isDown) handle({x: e.screenX - baseX, y: e.screenY - baseY})
      }
      document.onmouseup = (e: MouseEvent) => {
        isDown = false
        document.onmousemove = null
        document.onmouseup = null
      }
    })

    // el.addEventListener('mousemove', (e: MouseEvent) => {
    //   if (!isDown) return
    //   const x = e.screenX - baseX
    //   const y = e.screenY - baseY
    //   handle({x, y})
    // })

    // el.addEventListener('mouseup', (e: MouseEvent) => {
    //   isDown = false
    // })
  },
}