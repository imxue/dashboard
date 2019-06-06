export const login = {
  path: '/login',
  component: () => import('@/views/login/login')
}
export const login2 = {
  path: '/login/reset',
  component: () => import('@/views/login/reset')
}
export const enroll = {
  path: '/enroll',
  name: 'enroll',
  component: () => import('@/views/login/enroll')
}

export const login3 = {
  path: '/404',
  component: () => import('@/views/404'),
  hidden: true
}

export const all = {
  path: '*',
  redirect: '/404',
  hidden: true
}
