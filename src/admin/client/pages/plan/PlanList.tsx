import { Helmet } from 'react-helmet-async';
import PlansView from '../../sections/Plans/PlansView';

const PlanList = () => {
  return (
    <>
      <Helmet>
        <title>FAQ list</title>
      </Helmet>

      <PlansView />
    </>
  );
};

export default PlanList;
