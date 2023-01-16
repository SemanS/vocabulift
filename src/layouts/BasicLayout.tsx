import { HomeOutlined } from '@ant-design/icons'
import ProLayout from '@ant-design/pro-layout'
import { history, Link, useLocation } from '@vitjs/runtime'

import TranslateBox from '@/components/TranslateBox/TranslateBox'
import GlobalFooter from '@/containers/GlobalFooter'

import defaultSettings from '../../config/defaultSettings'

import type { BasicLayoutProps as ProLayoutProps } from '@ant-design/pro-layout'

export type BasicLayoutProps = {
  route: ProLayoutProps['route']
} & ProLayoutProps

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const location = useLocation()
  const text = "This is some text to be translated";
  const translations = ["Translation 1","Translation 2","Translation 3","Translation 4","Translation 5","Translation 6","Translation 7"];

  return (
    <ProLayout
      logo='https://github.com/vitjs/vit/raw/master/icons/logo.svg'
      {...props}
      onMenuHeaderClick={() => history.push('/')}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (
          menuItemProps.isUrl ||
          !menuItemProps.path ||
          location.pathname === menuItemProps.path
        ) {
          return defaultDom
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: (<HomeOutlined />) as any,
        },
        ...routers,
      ]}  
      itemRender={(route, params, routes, paths) => {
        const first = routes.indexOf(route) === 0
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        )
      }}
      footerRender={() => <GlobalFooter />}
      // waterMarkProps={{
      //   content: 'Vite React',
      //   fontColor: 'rgba(24,144,255,0.15)',
      // }}
      {...defaultSettings}
      >
      </ProLayout>
  )
}

export default BasicLayout
