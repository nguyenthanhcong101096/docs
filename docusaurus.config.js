/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
  title: 'Tech Note',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  favicon: 'img/oke_logo.png',
  themeConfig: {
    navbar: {
      logo: { src: 'img/oke_logo.png' },
      items: [
        {
          type: 'doc',
          docId: 'intro',
          position: 'left',
          label: 'Docs',
        },
        {
          to: '/blog',
          label: 'Blog', 
          position: 'left'
        },
        {
          type: 'search',
          position: 'left',
        },
      ],
    },
    prism: {
      theme: require('prism-react-renderer/themes/dracula'),
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/nguyenthanhcong101096/docs/blob/master/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/nguyenthanhcong101096/docs/blob/master/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
  plugins: [
    require.resolve('@cmfcmf/docusaurus-search-local')
  ]
};
