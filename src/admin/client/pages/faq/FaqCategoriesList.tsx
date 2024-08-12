import { Helmet } from 'react-helmet-async';
import FaqCategoriesView from '../../sections/FAQ/FAQCategoriesView';

const FaqCategoriesList = () => {
  return (
    <>
      <Helmet>
        <title>FAQ categories</title>
      </Helmet>

      <FaqCategoriesView />
    </>
  );
};

export default FaqCategoriesList;
