import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ManageProductApi } from '../../manageProduct.api.client';
import { IProductData } from '../../../manageProduct.client';
import { ProductStatus } from '../../../../models/Product.status.enum';
import { useTranslations } from '../../../../../translation/translation.context';
import { Basic, EditSubProduct, Product } from '../../manageProductContext';
import ProductListCard from '../../../../../layouts/shared/ProductListCard';
import Loader from '../../../../../layouts/shared/Loader';
import CustomDialog from '../../../../../layouts/shared/Dialog';

interface ISummary {
  setSubProductForm?: (subProductForm: boolean) => void;
}

const Summary: FC<ISummary> = ({ setSubProductForm }) => {
  const tr = useTranslations();

  const shouldLog = useRef(true);

  const { currentPlanData } = useContext(Basic);
  const { productData, setProductData } = useContext(Product);
  const { setEditSubProduct } = useContext(EditSubProduct);

  const { product } = productData;

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [subProducts, setSubProducts] = useState<IProductData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    const fetchSubProducts = () => {
      if (product.id) {
        ManageProductApi.getSubProducts(product.id)
          .then((subProducts) => {
            setSubProducts(subProducts);
            setIsLoading(false);
          })
          .catch((error) => console.error(error));
      }
    };

    if (shouldLog.current) {
      shouldLog.current = false;

      fetchSubProducts();
    }
  }, []);

  const handleQuantityUpdate = useCallback(
    (productId: number, value: number) => {
      ManageProductApi.updateProductQuantity(productId, value)
        .then(() => {
          setProductData((prevProductData) => ({
            ...prevProductData,
            product: {
              ...prevProductData.product,
              quantity: value,
            },
          }));
        })
        .catch((error) => console.error(error));
    },
    [setProductData],
  );

  const handleQuantityChange = useCallback(
    (value: number) => handleQuantityUpdate(product.id, value),
    [product.id, handleQuantityUpdate],
  );

  const productListCardProps = useMemo(
    () => ({
      footerButtons: (
        <button className="btn --light" onClick={() => (window.location.href = tr.link(product.url))}>
          {tr.get('manageProduct.summary.Preview')}
        </button>
      ),
      onQuantityChange: handleQuantityChange,
      quantity: true,
      product,
      parentTag: 'li',
      showLinks: false,
    }),
    [handleQuantityChange, product],
  );

  const handleDelete = useCallback((subProductId: number) => {
    setDeleteId(subProductId);
    setIsDeleteModalOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteId !== null) {
      ManageProductApi.deleteProduct(deleteId)
        .then(() => {
          const updatedSubProducts = subProducts.filter((subProduct) => subProduct.product.id !== deleteId);
          setSubProducts(updatedSubProducts);
          setDeleteId(null);
          setIsDeleteModalOpen(false);
        })
        .catch((error) => console.error(error));
    }
  }, [deleteId, subProducts]);

  const handlePublishProduct = useCallback(() => {
    ManageProductApi.updateProductStatus(product.id, ProductStatus.Published)
      .then(() => {
        window.location.href = tr.link(product.url);
      })
      .catch((error) => console.error(error));
  }, [product.id, product.url]);

  return (
    <div className="summary-tab">
      <h2 className="form__title">{tr.get('manageProduct.tabsTitle.summary')}</h2>

      <ul>
        <ProductListCard {...productListCardProps} />
        {!isLoading ? (
          subProducts.map((subProduct) => (
            <ProductListCard
              parentTag="li"
              key={subProduct.product.id}
              product={subProduct.product}
              quantity
              onQuantityChange={(value) => handleQuantityUpdate(subProduct.product.id, value)}
              showLinks={false}
              headerButtons={[
                <button
                  key="edit-button"
                  title={`${tr.get('manageProduct.summary.EditProduct')} ${subProduct.product.title}`}
                  className="product-list-card__header-btn"
                  onClick={() => {
                    setEditSubProduct(subProduct);
                    setSubProductForm(true);
                  }}
                >
                  <i className="icon icon-edit" />
                </button>,
                <button
                  key="remove-button"
                  title={`${tr.get('manageProduct.summary.RemoveProduct')} ${subProduct.product.title}`}
                  className="product-list-card__header-btn"
                  onClick={() => handleDelete(subProduct.product.id)}
                >
                  <i className="icon icon-garbage" />
                </button>,
              ]}
              footerButtons={
                <button
                  className="btn --light"
                  onClick={() => (window.location.href = tr.link(subProduct.product.url))}
                >
                  Preview
                </button>
              }
            />
          ))
        ) : (
          <Loader relative classes="summary-loader" />
        )}
      </ul>

      <div className="summary-tab__buttons">
        <button className="btn --primary" onClick={() => setSubProductForm(true)} disabled={!currentPlanData}>
          {currentPlanData
            ? tr.get('manageProduct.summary.AddANewColorMaterialOrSize')
            : tr.get('manageProduct.ToCreateANewProductYouHaveToBuyAPlan')}
        </button>
        <button className="btn --light" onClick={handlePublishProduct}>
          {tr.get('manageProduct.summary.PublishTheProduct')}
        </button>
      </div>

      <CustomDialog classes="remove-sub-product" isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <h1 className="remove-sub-product__title">{tr.get('manageProduct.summary.DoYouWantToDeleteThisProduct')}?</h1>
        <div className="remove-sub-product__buttons">
          <button className="btn --primary" onClick={() => setIsDeleteModalOpen(false)}>
            {tr.get('manageProduct.summary.NoKeepIt')}
          </button>
          <button className="btn --dark" onClick={handleConfirmDelete}>
            {tr.get('manageProduct.summary.YesDeleteIt')}
          </button>
        </div>
      </CustomDialog>
    </div>
  );
};

export default Summary;
