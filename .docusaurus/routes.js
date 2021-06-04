
import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';
export default [
{
  path: '/',
  component: ComponentCreator('/','deb'),
  exact: true,
},
{
  path: '/__docusaurus/debug',
  component: ComponentCreator('/__docusaurus/debug','3d6'),
  exact: true,
},
{
  path: '/__docusaurus/debug/config',
  component: ComponentCreator('/__docusaurus/debug/config','914'),
  exact: true,
},
{
  path: '/__docusaurus/debug/content',
  component: ComponentCreator('/__docusaurus/debug/content','c28'),
  exact: true,
},
{
  path: '/__docusaurus/debug/globalData',
  component: ComponentCreator('/__docusaurus/debug/globalData','3cf'),
  exact: true,
},
{
  path: '/__docusaurus/debug/metadata',
  component: ComponentCreator('/__docusaurus/debug/metadata','31b'),
  exact: true,
},
{
  path: '/__docusaurus/debug/registry',
  component: ComponentCreator('/__docusaurus/debug/registry','0da'),
  exact: true,
},
{
  path: '/__docusaurus/debug/routes',
  component: ComponentCreator('/__docusaurus/debug/routes','244'),
  exact: true,
},
{
  path: '/blog',
  component: ComponentCreator('/blog','cbf'),
  exact: true,
},
{
  path: '/blog/balancer',
  component: ComponentCreator('/blog/balancer','29b'),
  exact: true,
},
{
  path: '/blog/httpaccess',
  component: ComponentCreator('/blog/httpaccess','8dc'),
  exact: true,
},
{
  path: '/blog/kubeadm',
  component: ComponentCreator('/blog/kubeadm','1e3'),
  exact: true,
},
{
  path: '/blog/minikubeancer',
  component: ComponentCreator('/blog/minikubeancer','18e'),
  exact: true,
},
{
  path: '/blog/ssl',
  component: ComponentCreator('/blog/ssl','be1'),
  exact: true,
},
{
  path: '/blog/tags',
  component: ComponentCreator('/blog/tags','8db'),
  exact: true,
},
{
  path: '/blog/tags/docusaurus',
  component: ComponentCreator('/blog/tags/docusaurus','dd7'),
  exact: true,
},
{
  path: '/blog/tags/facebook',
  component: ComponentCreator('/blog/tags/facebook','3f4'),
  exact: true,
},
{
  path: '/blog/tags/hello',
  component: ComponentCreator('/blog/tags/hello','2ba'),
  exact: true,
},
{
  path: '/markdown-page',
  component: ComponentCreator('/markdown-page','be1'),
  exact: true,
},
{
  path: '/docs',
  component: ComponentCreator('/docs','b2a'),
  
  routes: [
{
  path: '/docs/amazon/codebuild',
  component: ComponentCreator('/docs/amazon/codebuild','4de'),
  exact: true,
},
{
  path: '/docs/amazon/ecs',
  component: ComponentCreator('/docs/amazon/ecs','a1d'),
  exact: true,
},
{
  path: '/docs/amazon/eks',
  component: ComponentCreator('/docs/amazon/eks','ecd'),
  exact: true,
},
{
  path: '/docs/amazon/lamda',
  component: ComponentCreator('/docs/amazon/lamda','303'),
  exact: true,
},
{
  path: '/docs/amazon/load_balance',
  component: ComponentCreator('/docs/amazon/load_balance','e96'),
  exact: true,
},
{
  path: '/docs/amazon/ses',
  component: ComponentCreator('/docs/amazon/ses','945'),
  exact: true,
},
{
  path: '/docs/amazon/vpc',
  component: ComponentCreator('/docs/amazon/vpc','da0'),
  exact: true,
},
{
  path: '/docs/ansible/intro',
  component: ComponentCreator('/docs/ansible/intro','98e'),
  exact: true,
},
{
  path: '/docs/docker/intro',
  component: ComponentCreator('/docs/docker/intro','423'),
  exact: true,
},
{
  path: '/docs/intro',
  component: ComponentCreator('/docs/intro','e84'),
  exact: true,
},
{
  path: '/docs/kubernetes/ingess_cert_manger',
  component: ComponentCreator('/docs/kubernetes/ingess_cert_manger','f26'),
  exact: true,
},
{
  path: '/docs/kubernetes/intro',
  component: ComponentCreator('/docs/kubernetes/intro','bc0'),
  exact: true,
},
{
  path: '/docs/others/cap',
  component: ComponentCreator('/docs/others/cap','c6b'),
  exact: true,
},
{
  path: '/docs/others/git',
  component: ComponentCreator('/docs/others/git','313'),
  exact: true,
},
{
  path: '/docs/others/mina',
  component: ComponentCreator('/docs/others/mina','5d4'),
  exact: true,
},
{
  path: '/docs/others/puma',
  component: ComponentCreator('/docs/others/puma','746'),
  exact: true,
},
{
  path: '/docs/terraform/intro',
  component: ComponentCreator('/docs/terraform/intro','bf5'),
  exact: true,
},
{
  path: '/docs/vagrant/intro',
  component: ComponentCreator('/docs/vagrant/intro','084'),
  exact: true,
},
]
},
{
  path: '*',
  component: ComponentCreator('*')
}
];
