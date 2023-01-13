// @ts-nocheck
import { dynamic } from '@vitjs/runtime';
import React from 'react';
import SmileOutlined from '@ant-design/icons/SmileOutlined'
import StarOutlined from '@ant-design/icons/StarOutlined'

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
                "path": "/",
                "redirect": "/book",
                "exact": true
              },
              {
                "path": "/book",
                "icon": React.createElement(SmileOutlined),
                "name": "欢迎页",
                "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/pages/Book'), loading: LoadingComponent}),
                "exact": true
              },
              {
                "path": "/ant-design",
                "icon": React.createElement(StarOutlined),
                "name": "Ant Design",
                "component": dynamic({ loader: () => import('/Users/macbook/Projects/vocabulift/src/pages/AntDesign'), loading: LoadingComponent}),
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
