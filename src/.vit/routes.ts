// @ts-nocheck
import { dynamic } from '@vitjs/runtime';
import React from 'react';
import BookOutlined from '@ant-design/icons/BookOutlined'

import LoadingComponent from '/Users/macbook/Projects/vocabulift/src/components/PageLoading';

export default function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/layouts/RootLayout'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/",
        "routes": [
          {
            "path": "/",
            "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/layouts/BasicLayout'), loading: LoadingComponent}),
            "routes": [
              {
                "path": "/books",
                "icon": React.createElement(BookOutlined),
                "name": "Books",
                "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/pages/Books'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/books/:title",
                "name": "Book Detail",
                "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/pages/BookDetail'), loading: LoadingComponent}),
                "hideInMenu": true,
                "exact": true
              }
            ]
          },
          {
            "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/pages/404'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  },
  {
    "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/pages/404'), loading: LoadingComponent}),
    "exact": true
  }
];
  return routes;
}
