import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import CompanyTeam from './CompanyTeam';
import CompanyInfoSlider from './CompanyInfoSlider';
import { StaticPage } from '../../page/models/StaticPage';
import React from 'react';

const CompanyPage = (appInfo, page: StaticPage) => {
  const breadcrumbs = [{ title: 'Company' }];
  const companyGallery = () => Array(6).fill(['/images/productCard.png']);

  return (
    <>
      <Breadcrumbs crumbs={breadcrumbs} />
      <section className="company-container --small">
        <h1 className="company__title">People who love luxury watches inspire us as much as precious timepieces</h1>
        <h2 className="company__subtitle">
          That’s why sellers and buyers of luxury watches have our undivided attention
        </h2>
        <div className="company__statistics">
          <div className="company__statistic">
            <span>47</span>
            <p>Team members</p>
          </div>
          <div className="company__statistic">
            <span>20</span>
            <p>Years of experience</p>
          </div>
          <div className="company__statistic">
            <span>2</span>
            <p>Offices in 2 countries</p>
          </div>
          <div className="company__statistic">
            <span>1k</span>
            <p>Well-known brands</p>
          </div>
        </div>
        <div className="company__gallery">
          <div className="company__gallery-items">
            {companyGallery().map((item, index) => (
              <div className="company__gallery-item" key={index}>
                <img src={item} />
              </div>
            ))}
          </div>
          <div className="company__gallery-buttons">
            <button className="company__gallery-button__next" title="Next">
              <i className="icon icon-arrow" />
            </button>
            <button className="company__gallery-button__prev" title="Prev">
              <i className="icon icon-arrow" />
            </button>
          </div>
        </div>
        <div className="page-content" dangerouslySetInnerHTML={{ __html: page.content }}></div>
      </section>
      <CompanyInfoSlider />
      <CompanyTeam />
      <div id="feedback-root"></div>
    </>
  );
};

export default CompanyPage;
