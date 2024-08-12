import { useTranslations } from '../../../translation/translation.context';
import MarkdownIt from 'markdown-it';

const markdown = new MarkdownIt({
  html: false,
  linkify: true,
  breaks: true,
});

const CompanyInfoSlider = () => {
  const tr = useTranslations();

  const companyInfoSlider = [
    {
      subTitle: tr.get('common.FactsAndFigures'),
      title: 'Patek Philippe',
      text:
        'Heritage Marketing: Patek Philippe\'s slogan "You never actually own a Patek Philippe. You merely look after it for the next generation" emphasizes the sentimental value of their watches.\n' +
        'Record-Breaking Auctions: Patek Philippe holds numerous records for the highest prices paid for wristwatches at auctions, with some watches fetching over $31 million.\n' +
        "Prestigious Reputation: Patek Philippe is consistently ranked among the world's most prestigious and valuable watch brands, with a brand value of over $1.3 billion.\n",
    },
    {
      subTitle: tr.get('common.FactsAndFigures'),
      title: 'Omega',
      text:
        'Space Exploration Association: Omega is the official timekeeper for NASA and was the first watch worn on the moon.\n' +
        '"Moonwatch" Legacy: Omega\'s Speedmaster, known as the "Moonwatch," gained immense popularity after being the first watch on the moon during Apollo 11 in 1969.\n' +
        'Historic Partnerships: Omega has been the official timekeeper of the Olympic Games 28 times and is endorsed by over 5,000 professional athletes worldwide.\n',
    },
    {
      subTitle: tr.get('common.FactsAndFigures'),
      title: 'Rolex',
      text:
        'Celebrity Endorsement: Rolex watches have been worn by influential figures, including James Bond in multiple movies.\n' +
        'Global Market Dominance: Rolex holds a significant share of the luxury watch market, selling approximately 800,000 to 1 million watches annually.\n' +
        "Sponsorship Impact: Rolex's sponsorship of prestigious events like Wimbledon contributes to its global brand value of over $7.9 billion.\n",
    },
    {
      subTitle: tr.get('common.FactsAndFigures'),
      title: 'Audemars Piguet',
      text:
        'Artistic Collaborations: Audemars Piguet collaborates with contemporary artists and designers to create limited-edition timepieces that appeal to art collectors and watch enthusiasts alike.\n' +
        "Limited-Edition Appeal: Audemars Piguet's limited-edition collaborations with artists and designers often sell out quickly, with some models commanding premiums of up to 50% on the secondary market.\n" +
        "Impressive Revenue: Audemars Piguet's annual revenue exceeds $800 million, solidifying its position as one of the top luxury watch brands globally.\n",
    },
    {
      subTitle: tr.get('common.FactsAndFigures'),
      title: 'Hublot',
      text:
        'Celebrity Endorsements: Hublot partners with sports admin-icons like Usain Bolt and top soccer clubs to elevate its brand appeal.\n' +
        'Social Media Success: Hublot has a massive social media presence, with over 3.5 million followers on Instagram, engaging watch enthusiasts worldwide.\n' +
        'Successful Endorsements: Hublot\'s collaboration with football superstar Cristiano Ronaldo resulted in the limited edition "CR7" timepiece, selling out within hours of release.\n',
    },
    {
      subTitle: tr.get('common.FactsAndFigures'),
      title: 'Cartier',
      text:
        "Storytelling Approach: Cartier's marketing campaigns use storytelling to highlight the romantic allure and rich history of their watch collections and brand image is strongly associated with luxury and elegance.\n" +
        'Star-Studded Following: Cartier is a favorite among celebrities, with notable figures like Princess Diana, Kate Middleton, and Tom Cruise frequently seen wearing Cartier timepieces.\n' +
        "Revenue Growth: Cartier's parent company, Richemont Group, reported an 11% increase in sales for Cartier watches in 2020.\n",
    },
    {
      subTitle: tr.get('common.FactsAndFigures'),
      title: 'Richard Mille',
      text:
        'High-Net-Worth Targeting: Richard Mille targets high-net-worth individuals like billionaires, athletes, and celebrities as their primary audience.\n' +
        'Sports Partnerships: Richard Mille has a strong presence in motorsports and collaborates with F1 drivers and tennis champions.\n' +
        'Remarkable Growth: Richard Mille has experienced significant growth over the years, with annual revenue exceeding $300 million.\n',
    },
    {
      subTitle: tr.get('common.FactsAndFigures'),
      title: 'TAG Heuer',
      text:
        'Pioneer in Luxury Watch Marketing: TAG Heuer was the first luxury watch brand to partner with professional race car drivers, emphasizing precision and performance.\n' +
        "Racing Heritage: TAG Heuer's connection with motorsports has been a cornerstone of its marketing, with partnerships in Formula 1 and endurance racing.\n" +
        'Market Presence: TAG Heuer has a wide retail network with over 160 boutiques worldwide and a strong online presence.\n',
    },
  ];

  return (
    <section className="company-info-container --small">
      <div className="company-info__inner">
        <div className="company-info__items">
          {companyInfoSlider.map(({ subTitle, title, text }, index) => (
            <div className="company-info__item" key={index}>
              <span className="company-info__item-subtitle">{subTitle}</span>
              <span className="company-info__item-title">{title}</span>
              <pre
                className="company-info__item-text"
                dangerouslySetInnerHTML={{ __html: markdown.render(text) }}
              ></pre>
            </div>
          ))}
        </div>
      </div>
      <button className="company-info__button-next" title="Next">
        <i className="icon icon-arrow" />
      </button>
      <button className="company-info__button-prev" title="Prev">
        <i className="icon icon-arrow" />
      </button>
    </section>
  );
};

export default CompanyInfoSlider;
