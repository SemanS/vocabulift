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
                path: '/books',
                icon: 'book',
                name: 'Books',
                component: './pages/Books',
                
              },
              {
                path: '/books/:title',
                name: 'Book Detail',
                component: './pages/BookDetail',
                hideInMenu: true
              }
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
];
