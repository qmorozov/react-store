import { FC } from 'react';
import { useTranslations } from '../../../translation/translation.context';

interface ISlide {
  id: number;
  name: string;
  link: string;
  image: string;
  order: number;
  active: boolean;
}

interface IBanner {
  slides: ISlide[];
}

const Banner: FC<IBanner> = ({ slides }) => {
  const tr = useTranslations();

  return (
    <section className="banner">
      <div className="banner__slider">
        <a className="banner__slide">
          <video className="banner__slide" style={{ objectFit: 'cover' }} autoPlay muted loop>
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </a>
        {slides.map(({ id, name, link, image }: ISlide) => (
          <a
            key={id}
            title={name}
            href={tr.link(link)}
            className="banner__slide"
            style={{ backgroundImage: `url(${image})` }}
          ></a>
        ))}
      </div>
      <span className="banner__pagination"></span>
    </section>
  );
};

export default Banner;
