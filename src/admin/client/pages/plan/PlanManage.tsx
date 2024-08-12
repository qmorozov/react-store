import { Helmet } from 'react-helmet-async';
import PlanManageView from '../../sections/Plans/PlanManageView';

const PlanManage = () => {
  return (
    <>
      <Helmet>
        <title>FAQ list</title>
      </Helmet>

      <PlanManageView />
    </>
  );
};

export default PlanManage;
