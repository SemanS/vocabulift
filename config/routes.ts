export default [
  {
    path: '/',
    component: './layouts/RootLayout',
    routes: [
      {
        path: '/',
        routes: [
          {
            path: '/',
            component: './layouts/BasicLayout',
            routes: [
              {
                path: '/',
                redirect: '/book',
              },
              {
                path: '/book',
                icon: 'smile',
                name: '欢迎页',
                component: './pages/Book',
              },
              {
                path: '/ant-design',
                icon: 'star',
                name: 'Ant Design',
                component: './pages/AntDesign',
              },
            ],
          },
          {
            component: './pages/404',
          },
        ],
      },
      {
        component: './pages/404',
      },
    ],
  },
  {
    component: './pages/404',
  },
]
