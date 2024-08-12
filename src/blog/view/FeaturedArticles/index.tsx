import Slider from '../../../layouts/shared/Slider';
import FeaturedArticle from '../FeaturedArticle';
import { useTranslations } from '../../../translation/translation.context';

const FeaturedArticles = () => {
  const tr = useTranslations();

  const FeaturedArticlesSlider = () =>
    Array(9).fill(
      <FeaturedArticle
        image="/images/productCard.png"
        tags={[
          { title: 'Brands', link: '/' },
          { title: 'Top10watches', link: '/' },
          { title: 'Videos', link: '/' },
        ]}
        title="Do watches have to retain their value?"
        date="Mar 29"
        articleLink="/"
      />,
    );

  return (
    <section className="featured-articles-container">
      <h2 className="featured-articles__title">{tr.get('blog.FeaturedArticles')}</h2>
      <Slider slides={FeaturedArticlesSlider()} navigationButtons />
    </section>
  );
};

export default FeaturedArticles;
