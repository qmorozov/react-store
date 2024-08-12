import { FC } from 'react';

interface IBlogCard {
  blogCardData: any;
  classes?: string;
}

const BlogCard: FC<IBlogCard> = ({ blogCardData, classes }) => {
  const { url, image, announce, title } = blogCardData;

  return (
    <div className={`blog-card ${classes ? classes : ''}`}>
      <a className="blog-card__img" href={`/blog/post/${url}`}>
        <img src={image ? image : '/images/box.jpg'} alt={title} title={title} />
      </a>
      <a className="blog-card__title" title={title} href={`/blog/post/${url}`}>
        {title}
      </a>
      <a className="blog-card__desc" href={`/blog/post/${url}`}>
        {announce}
      </a>
      <span className="blog-card__date">{blogCardData.category?.name}</span>
    </div>
  );
};

export default BlogCard;
