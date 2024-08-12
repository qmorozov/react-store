import { useTranslations } from 'src/translation/translation.context';

function ProductCardGallery({ product }) {
  const tr = useTranslations();

  return (
    <div className="product__gallery gallery" id="product-images-slider">
      <div className="gallery__top slider">
        <button id="closeButton" className="modal-close">
          {tr.get('productCard.Close')}
        </button>
        <div className="gallery__wrapper">
          {product?.images?.length ? (
            product?.images.map((item) => (
              <div className="gallery__item" key={item.id}>
                <img
                  className="open-full-screen slider-main-image"
                  loading="lazy"
                  src={item?.medium}
                  data-zoom={item?.large}
                  data-src-medium={item?.medium}
                  data-src-large={item?.large}
                />
              </div>
            ))
          ) : (
            <img src="/images/box.jpg" alt={product.title} />
          )}
        </div>

        <button className="slider__button-next" title="Next">
          <i className="icon icon-arrow" />
        </button>

        <button className="slider__button-prev" title="Prev">
          <i className="icon icon-arrow" />
        </button>

        <div className="product__gallery-zoom"></div>
      </div>

      <div className="gallery__thumbs">
        <div className="gallery__wrapper">
          {product?.images?.length
            ? product?.images.map((item) => (
                <div className="gallery__item" key={item.id}>
                  <img loading="lazy" src={item?.small} />
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default ProductCardGallery;
