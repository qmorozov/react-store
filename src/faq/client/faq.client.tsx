import { RenderClientPage } from '../../app/client/render-client-page';
import { TranslationContext } from '../../translation/translation.context';
import { Translations } from '../../translation/translation.provider.client';
import { useEffect, useState } from 'react';
import { FAQApi } from './faq.api.client';
import Tabs, { Tab } from '../../layouts/shared/Tabs';
import Breadcrumbs from '../../layouts/shared/Breadcrumbs';
import FaqOneTab from './FaqOneTab';
import Loader from '../../layouts/shared/Loader';

import './style/faq.client.scss';

(async () => {
  const translation = await Translations.load('faq', 'common', 'error');

  return RenderClientPage(() => {
    const breadcrumbs = [{ title: translation.get('faq.FAQ') }];
    const [faqData, setFaqData] = useState([]);
    const [visibleData, setVisibleData] = useState([]);

    useEffect(() => {
      if (!translation) return;

      FAQApi.getFaq()
        .then((response) => {
          setFaqData(response);
          setVisibleData(new Array(response.length).fill(4));
        })
        .catch((error) => console.log(error));
    }, [translation]);

    const handleVisible = (tabIndex: number) => {
      setVisibleData((prev) => {
        const next = [...prev];
        next[tabIndex] += 4;
        return next;
      });
    };

    const filteredFaqData = faqData.filter((data) => data.questions.length > 0);

    const faqTabs: Tab[] = filteredFaqData.map(({ id, title, questions }, tabIndex) => {
      const visibleQuestions = questions.slice(0, visibleData[tabIndex]);
      return {
        id,
        title,
        content: (
          <FaqOneTab
            totalQuestions={questions.length}
            faqQuestions={visibleQuestions}
            onMoreClick={() => handleVisible(tabIndex)}
            isShowMoreVisible={questions.length > visibleQuestions.length}
          />
        ),
      };
    });

    if (!translation || !faqTabs.length) {
      return <Loader />;
    }

    return (
      <TranslationContext.Provider value={translation}>
        <Breadcrumbs crumbs={breadcrumbs} />
        <section className="faq-container --small">
          <h1 className="faq__title">{translation.get('faq.FAQ')}</h1>
          <Tabs options={faqTabs} selectedTabId={faqTabs[0].id} />
        </section>
      </TranslationContext.Provider>
    );
  });
})();
