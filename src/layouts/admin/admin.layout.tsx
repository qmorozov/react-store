import { AppInfo } from '../../app/models/app-info';

const AdminLayout = (appInfo: AppInfo, children: JSX.Element): JSX.Element => {
  const clientUserInfo = ((info) => {
    const uInfoCopy = info ? { ...info } : null;
    if (uInfoCopy) {
      delete uInfoCopy.id;
    }
    return uInfoCopy;
  })(appInfo?.user || null);

  const uiCore = {
    user: clientUserInfo,
  };

  return (
    <>
      <div id="admin-root"></div>
      <script
        id="uiCoreData"
        type="application/json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(uiCore) }}
      ></script>
    </>
  );
};

export default AdminLayout;
