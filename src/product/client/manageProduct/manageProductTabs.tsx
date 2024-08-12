import { FC, useContext, useEffect, useRef, useState } from 'react';
import Tabs, { Tab } from '../../../layouts/shared/Tabs';
import General from './Tabs/General';
import Details from './Tabs/Details';
import Photos from './Tabs/Photos';
import Summary from './Tabs/Summary/Summary';
import { ImageFile, ISavedFiles } from '../../../layouts/shared/AddImage/useAddImage';
import { useTranslations } from '../../../translation/translation.context';
import Loader from '../../../layouts/shared/Loader';
import { Basic, Product, SuggestSendingProduct } from './manageProductContext';

export enum TabsEnum {
  general = 'general',
  details = 'details',
  photos = 'photos',
  summary = 'summary',
}

interface IManageProductTabs {
  manageProduct: (valueFunc?) => void;
  setDetails: (details: object) => void;
  setSubProductForm: (subProductForm: boolean) => void;
}

const ManageProductTabs: FC<IManageProductTabs> = ({ setSubProductForm, setDetails, manageProduct }) => {
  const tr = useTranslations();

  const { productData, setProductData } = useContext(Product);
  const { isSuggestProduct, setIsSendingData } = useContext(SuggestSendingProduct);
  const { visibleTabs, setVisibleTabs, setStep, step, currentPlanData, productId } = useContext(Basic);

  const generalRef = useRef(null);
  const photosRef = useRef(null);
  const detailsRef = useRef(null);

  // === photos component ===
  const [selectedPhotos, setSelectedPhotos] = useState<(ImageFile | ISavedFiles)[]>([]);

  const canUpload = selectedPhotos.some((image) => 'size' in image);

  const goToSummary = async (redirect = true) => {
    if (selectedPhotos.length) {
      if (canUpload) {
        await photosRef.current.uploadImages(false);
      }

      if (redirect) {
        setStep(TabsEnum.summary);
      }

      setVisibleTabs((prevState) => ({
        ...prevState,
        [TabsEnum.summary]: false,
      }));
    }
  };

  const [isChanges, setIsChanges] = useState(false);

  const saveChangesRedirect = async () => {
    const modifiedProductName = productData.product.title;

    const encodedProductName = encodeURIComponent(modifiedProductName);

    window.location.href = tr.link(`/shop?modifiedProduct=${encodedProductName}`);
  };

  const saveChanges = async () => {
    setIsSendingData(true);
    await manageProduct(async () => await saveChangesRedirect());
  };

  const [handleDetailsSave, setHandleDetailsSave] = useState(false);

  const handleDetailsNext = async () => {
    const isValid = await detailsRef.current.isValid();

    if (isValid) {
      if (!productId) {
        await detailsRef.current.handleSubmit();

        setHandleDetailsSave(true);
      }

      setStep(TabsEnum.photos);
      setVisibleTabs((prevState) => ({
        ...prevState,
        [TabsEnum.photos]: false,
      }));
    }
  };

  const handleChanges = async () => {
    if (step === TabsEnum.general && generalRef.current) {
      const isValid = await generalRef.current.isValid();

      await generalRef.current.handleButtonClick();

      if (isValid) {
        setIsChanges(true);
      }
    } else if (step === TabsEnum.details && detailsRef.current && detailsRef?.current?.isValid()) {
      await detailsRef.current.handleSubmit(() => {
        setIsChanges(true);
      });
    } else if (step === TabsEnum.summary) {
      setIsChanges(true);
    }
  };

  useEffect(() => {
    if (handleDetailsSave) {
      manageProduct();

      setHandleDetailsSave(false);
    }
  }, [handleDetailsSave]);

  useEffect(() => {
    if (isChanges) {
      saveChanges();
      setIsChanges(false);
    }
  }, [isChanges]);

  const manageProductTabs: Tab[] = [
    {
      id: TabsEnum.general,
      title: tr.get(`manageProduct.tabsTitle.${TabsEnum.general}`),
      disabled: visibleTabs[TabsEnum.general],
      content: (
        <>
          <General ref={generalRef} isSuggestProduct={isSuggestProduct} />
          {productId && (
            <button className="manage-product__save-btn" onClick={handleChanges}>
              {tr.get('manageProduct.saveChangesButton')}
            </button>
          )}
        </>
      ),
      onClick: () => setStep(TabsEnum.general),
    },
    {
      id: TabsEnum.details,
      title: tr.get(`manageProduct.tabsTitle.${TabsEnum.details}`),
      disabled: visibleTabs[TabsEnum.details],
      content: (
        <>
          <Details
            ref={detailsRef}
            setDetails={setDetails}
            productData={productData}
            isSuggestProduct={isSuggestProduct}
          />
          <button type="button" className="btn --primary" onClick={() => handleDetailsNext()}>
            {tr.get('manageProduct.next')}: {tr.get(`manageProduct.tabsTitle.${TabsEnum.details}`)}
          </button>
          {productId && (
            <button className="manage-product__save-btn" onClick={handleChanges}>
              {tr.get('manageProduct.saveChangesButton')}
            </button>
          )}
        </>
      ),
      onClick: () => setStep(TabsEnum.details),
      onRemove: async () => {
        if (detailsRef?.current?.isValid()) {
          await detailsRef.current.handleSubmit(() => {
            if (!productId) manageProduct();
            setVisibleTabs((prevState) => ({
              ...prevState,
              [TabsEnum.photos]: false,
            }));
          });
        }
      },
    },
    {
      id: TabsEnum.photos,
      title: tr.get(`manageProduct.tabsTitle.${TabsEnum.photos}`),
      disabled: visibleTabs[TabsEnum.photos],
      content: (
        <>
          {productData.product.id ? (
            <Photos
              ref={photosRef}
              productData={productData}
              setProductData={setProductData}
              setSelectedPhotos={setSelectedPhotos}
            />
          ) : (
            <Loader relative classes="manage-product__photo-loader" />
          )}
          <button className="btn --primary" disabled={!selectedPhotos.length} onClick={() => goToSummary()}>
            {tr.get('manageProduct.next')}: {tr.get(`manageProduct.tabsTitle.${TabsEnum.photos}`)}
          </button>
        </>
      ),
      onClick: () => setStep(TabsEnum.photos),
      onRemove: () => goToSummary(false),
    },
    {
      id: TabsEnum.summary,
      title: tr.get(`manageProduct.tabsTitle.${TabsEnum.summary}`),
      disabled: visibleTabs[TabsEnum.summary],
      content: (
        <>
          <Summary setSubProductForm={setSubProductForm} />
          {productId && (
            <button className="manage-product__save-btn" onClick={handleChanges}>
              {tr.get('manageProduct.saveChangesButton')}
            </button>
          )}
        </>
      ),
      onClick: () => setStep(TabsEnum.summary),
    },
  ];

  return <Tabs options={manageProductTabs} selectedTabId={step} />;
};

export default ManageProductTabs;
