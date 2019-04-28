// import router from '../router'

// router.beforeEach((to, from, next) => {
//   let i = localStorage.getItem('IsLogin')
//   if (i) {
//     next()
//   } else {
//     // 沒有登錄 判斷路由
//     let x = to.path.indexOf('/login')
//     let y = to.path.indexOf('/enroll')
//     if (x === -1) { // 如果去的不是/ login 重定向到login
//       if (y === -1) {
//         next({ path: '/login' })
//       } else {
//         next()
//       }
//     } else {
//       next()
//     }
//   }
// })
