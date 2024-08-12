import React from 'react';
import { TranslationContext } from '../../translation/translation.context';
import { AppInfo } from '../../app/models/app-info';
import { BlogCategory } from '../model/BlogCategory';
import { BlogPost } from '../model/BlogPost';
import { PaginationService } from '../../catalog/service/pagination.service';
import Breadcrumbs from 'src/layouts/shared/Breadcrumbs';
import BlogCard from '../../layouts/shared/BlogCard';

const BlogPage = (
  appInfo: AppInfo,
  categories: BlogCategory[],
  currentCategory: BlogCategory | null,
  posts: BlogPost[],
  pagination: PaginationService,
): JSX.Element => {
  const breadcrumbs = [{ title: 'Blog' }];

  return (
    <TranslationContext.Provider value={appInfo.translation}>
      <Breadcrumbs crumbs={breadcrumbs} />

      <section className="blog-container --small">
        <h1 className="blog__title">{appInfo.translation.get('blog.Magazine')}</h1>

        <div className="blog-tabs">
          <a href={`/blog`} className={!currentCategory ? '--active' : ''}>
            {appInfo.translation.get('common.All')}
          </a>
          {categories.map(({ id, name, url }) => (
            <a key={id} href={`/blog/${url}`} className={currentCategory?.url === url ? '--active' : ''}>
              {name}
            </a>
          ))}
        </div>

        <div className="blog-card-items">
          {posts.map((post) => (
            <BlogCard key={post.id} blogCardData={post} />
          ))}
        </div>

        {/*<FeaturedArticles />*/}
      </section>
    </TranslationContext.Provider>
  );
};

export default BlogPage;
