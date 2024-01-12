import { Icon } from '@iconify/react';
import homeFill from '@iconify/icons-eva/home-fill';
import fileFill from '@iconify/icons-eva/file-fill';
import roundGrain from '@iconify/icons-ic/round-grain';
import bookOpenFill from '@iconify/icons-eva/book-open-fill';
import router from 'router/router';

const ICON_SIZE = {
  width: 22,
  height: 22
};

const menuConfig = [
  {
    title: 'Home',
    icon: <Icon icon={homeFill} {...ICON_SIZE} />,
    path: router.generatePath('landing.home')
  },
  {
    title: 'Pricing',
    icon: <Icon icon={bookOpenFill} {...ICON_SIZE} />,
    path: router.generatePath('landing.pricing')
  },
  // {
  //   title: 'Resources',
  //   icon: <Icon icon={fileFill} {...ICON_SIZE} />,
  //   path: '/#',
  //   children: [
  //     {
  //       subheader: 'Resources',
  //       items: [
  //         {
  //           title: 'Blog',
  //           subtitle: 'Guides, reports and best practices',
  //           path: 'https://articles.realjournals.com/blog'
  //         },
  //         {
  //           title: 'Events & Webinars',
  //           subtitle: 'Learn from where ever you are',
  //           path: 'https://articles.realjournals.com/events'
  //         },
  //         {
  //           title: 'Community',
  //           subtitle: 'Connect, learn and engage with Real Journal users',
  //           path: 'https://articles.realjournals.com/community'
  //         }
  //       ]
  //     },
  //     {
  //       subheader: 'Resources 2',
  //       items: [
  //         {
  //           title: 'Training & Certifications',
  //           subtitle: 'Learn how to use Real Journals',
  //           path: 'https://articles.realjournals.com/training'
  //         },
  //         {
  //           title: 'Partners',
  //           subtitle: 'How to locate or become a Real Journals Partner',
  //           path: 'https://articles.realjournals.com/partners'
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    title: 'Contact Us',
    icon: <Icon icon={bookOpenFill} {...ICON_SIZE} />,
    path: router.generatePath('landing.contact-us')
  }
];

export default menuConfig;
