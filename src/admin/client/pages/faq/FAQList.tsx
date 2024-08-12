import { Helmet } from 'react-helmet-async';
import FAQListView from '../../sections/FAQ/FAQListView';

const FAQList = () => {
  return (
    <>
      <Helmet>
        <title>FAQ list</title>
      </Helmet>

      <FAQListView />
    </>
  );
};

export default FAQList;
