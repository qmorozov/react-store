import Breadcrumbs from 'src/layouts/shared/Breadcrumbs';
import { TranslationContext } from '../../translation/translation.context';
import { AppInfo } from '../../app/models/app-info';
import { BlogPost } from '../model/BlogPost';
import { Fragment } from 'react';

const BlogPostPage = (appInfo: AppInfo, post: BlogPost): JSX.Element => {
  const blogOneBreadcrumbs = [{ title: 'Blog' }];

  const { title, image, content, createdAt } = post;

  const languages = (Object.keys(appInfo.translation.available || {}) || ['en']).map((lang) => ({
    code: lang,
  }));
  const currentLanguage = languages.find((l) => l.code === appInfo.translation.language);

  const formattedDate = new Intl.DateTimeFormat(currentLanguage.code, {
    month: 'short',
    day: 'numeric',
  }).format(new Date(createdAt));

  const paragraphs = content.split('\n');

  return (
    <TranslationContext.Provider value={appInfo.translation}>
      <Breadcrumbs crumbs={blogOneBreadcrumbs} />

      <section className="blog-one-container --small">
        <h1 className="blog-one__title">{title}</h1>

        <span className="blog-one__date">{formattedDate}</span>

        {paragraphs.map((paragraph, index) => (
          <Fragment key={index}>
            {paragraph.trim().length > 0 && (
              <div className="blog-one__content" dangerouslySetInnerHTML={{ __html: paragraph }}></div>
            )}
          </Fragment>
        ))}
      </section>
    </TranslationContext.Provider>
  );
};

export default BlogPostPage;
