import { FC, ReactChild, ReactNode, useState, useRef, useEffect } from 'react';

interface IAccordion {
  title: ReactChild | string;
  children: ReactNode;
  classes?: string;
  arrow?: boolean;
  absolute?: boolean;
}

const Accordion: FC<IAccordion> = ({ title, children, classes, arrow, absolute }) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const accordionRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const toggleAccordion = () => {
    setIsVisible(!isVisible);
    setHeight(isVisible ? 0 : contentRef.current?.scrollHeight || 0);
  };

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (accordionRef.current && !accordionRef.current.contains(event.target as Node)) {
        setIsVisible(false);
        setHeight(0);
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [accordionRef]);

  const headerClasses = `accordion__header ${isVisible ? '--open' : ''}`;
  const contentClasses = `accordion__content ${isVisible ? '--open' : ''}`;
  const containerClasses = classes || '';

  return (
    <div ref={accordionRef} className={containerClasses}>
      <div onClick={toggleAccordion} className={headerClasses}>
        <div className="accordion__value">
          <span>{title}</span>
          {arrow && <i className="icon icon-arrow"></i>}
        </div>
      </div>
      <div
        ref={contentRef}
        className={contentClasses}
        style={{ height: `${height + 1}px`, position: absolute ? 'absolute' : null }}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;
