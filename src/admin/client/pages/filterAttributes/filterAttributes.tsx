import { Helmet } from 'react-helmet-async';
import FilterAttributesView from '../../sections/FilterAttributes/FilterAttributesView';

const FilterAttributes = () => {
  return (
    <>
      <Helmet>
        <title>Filter Attributes</title>
      </Helmet>

      <FilterAttributesView />
    </>
  );
};

export default FilterAttributes;
