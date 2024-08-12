import React from 'react';
import { AppInfo } from '../../app/models/app-info';
import { StaticPage } from '../models/StaticPage';
// import MarkdownIt from 'markdown-it';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';

// const markdown = new MarkdownIt({
//   html: false,
//   linkify: true,
//   breaks: true,
// });

const Page = (info: AppInfo, page: StaticPage) => {
  const breadcrumbs = [{ title: page.title }];

  return (
    <>
      <Breadcrumbs crumbs={breadcrumbs} />
      <section className="page-container --small">
        <h1>{page.title}</h1>
        <div className="page-content" dangerouslySetInnerHTML={{ __html: page.content }}></div>
      </section>
    </>
  );
};

export default Page;
