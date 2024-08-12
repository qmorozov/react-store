import { Helmet } from 'react-helmet-async';
import FAQManageCategoryView from '../../sections/FAQ/FAQManageCategoryView';

const FaqManageCategories = () => {
  return (
    <>
      <Helmet>
        <title>FAQ manage</title>
      </Helmet>

      <FAQManageCategoryView />
    </>
  );
};

export default FaqManageCategories;
