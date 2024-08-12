import { useContext, useState } from 'react';
import { useTranslations } from '../../../../translation/translation.context';
import { useForm } from 'react-hook-form';
import { PageQuery } from '../../../../app/services/page-query.client';
import FilterContext from '../../filterContext';
import FilterCategory from '../FIlterCategory';

const ProductTab = () => {
  const tr = useTranslations();
  const { handleSubmit } = useForm();
  const filterMetaData = useContext(FilterContext);
  const [showMore, setShowMore] = useState(false);

  const onSubmitProductData = () => {
    PageQuery.set('filter', filterMetaData.serialize());
  };

  return (
    <form onSubmit={handleSubmit(onSubmitProductData)}>
      <FilterCategory showMore={showMore} />
      <div className="catalog__buttons">
        <button className="btn --primary" type="submit">
          {tr.get('common.Find')} (3,839)
        </button>
        <button className="btn --dark" type="button" onClick={() => setShowMore(!showMore)}>
          {tr.get(`common.${!showMore ? 'More' : 'Less'}Filters`)}
        </button>
      </div>
    </form>
  );
};

export default ProductTab;
