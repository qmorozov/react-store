import { FC } from 'react';
import { useTranslations } from '../../../translation/translation.context';
import MarkdownIt from 'markdown-it';
import Accordion from '../../../layouts/shared/Accordion';
import Loader from '../../../layouts/shared/Loader';

export interface IFaqQuestion {
  title: string;
  answer: string;
  id: string;
}

interface IFaqQuestions {
  faqQuestions: IFaqQuestion[];
  onMoreClick: () => void;
  isShowMoreVisible: boolean;
}

const FaqOneTab: FC<IFaqQuestions & { totalQuestions: number }> = ({
  faqQuestions,
  totalQuestions,
  onMoreClick,
  isShowMoreVisible,
}) => {
  const md = new MarkdownIt();
  const tr = useTranslations();

  if (!faqQuestions) {
    return <Loader />;
  }

  const remainingQuestions = totalQuestions - faqQuestions.length;

  return (
    <>
      <div className="faq__items">
        {faqQuestions.map(({ title, answer, id }: IFaqQuestion) => (
          <Accordion arrow title={title} classes="faq__item" key={id}>
            <div className="faq__item-body" dangerouslySetInnerHTML={{ __html: answer }} />
          </Accordion>
        ))}
      </div>
      {isShowMoreVisible && (
        <button className="show-more-btn" onClick={onMoreClick}>
          {tr.get('common.More')} {remainingQuestions}
        </button>
      )}
    </>
  );
};

export default FaqOneTab;
