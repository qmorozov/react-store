import { FC } from "react";

interface IFeaturedArticleTags {
  title: string;
  link: string
}

interface IFeaturedArticle {
  image: string;
  tags: IFeaturedArticleTags[];
  title: string;
  date: string;
  articleLink: string;
}

const FeaturedArticle: FC<IFeaturedArticle> = ({
    image,
    articleLink,
    title,
    tags,
    date
}) => {
  return (
    <div className="featured-article">
      <a className="featured-article__img" href={articleLink}>
        <img src={image} alt={title} />
      </a>
      <ul className="featured-article__tags">
        {tags.map(({ title, link }, index) => (
          <li key={`${title.split(/\s+/).join('')}_${index}`}>
            <a href={link} title={title}>
              #{title}
            </a>
          </li>
        ))}
      </ul>
      <a
        title={title}
        href={articleLink}
        className="featured-article__title"
      >
        {title}
      </a>
      <span className="featured-article__date">
        {date}
      </span>
    </div>
  );
};

export default FeaturedArticle;