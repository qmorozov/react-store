import { FC, ReactNode, useEffect, useState } from 'react';
import { Tab } from '@headlessui/react';

export interface Tab {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

interface ITabs {
  options: Tab[];
  classes?: string;
  subTabs?: boolean;
  selectedTabId?: Tab['id'];
}

const Tabs: FC<ITabs> = ({ options, selectedTabId, classes, subTabs }) => {
  const [selectedTab, setSelectedTab] = useState(selectedTabId);
  const [previousTabStack, setPreviousTabStack] = useState<string[]>([]);

  useEffect(() => {
    if (selectedTabId !== selectedTab) {
      setSelectedTab(selectedTabId);
    }
  }, [selectedTabId]);

  const handleTabChange = (index: number) => {
    const selectedTabId = options[index].id;

    const previousTabId = selectedTab;
    const previousTab = options.find((tab) => tab.id === previousTabId);
    if (previousTab && previousTab.onRemove) {
      previousTab.onRemove();
    }

    setSelectedTab(selectedTabId);
    setPreviousTabStack((prevStack) => [...prevStack, previousTabId]);
  };

  const handleTabRemove = (index: number) => {
    const removedTabId = options[index].id;
    const newTabStack = previousTabStack.filter((tabId) => tabId !== removedTabId);
    setPreviousTabStack(newTabStack);
  };

  return (
    <div className={`${classes ? classes : ''} ${subTabs ? 'sub-tabs' : 'tabs'}`}>
      <Tab.Group selectedIndex={options.findIndex(({ id }) => id === selectedTab)} onChange={handleTabChange}>
        <Tab.List className="tabs__list">
          {options.map(({ title, id, disabled = false, onClick }, index) => (
            <Tab
              key={id}
              disabled={disabled}
              onClick={() => {
                if (onClick) {
                  onClick();
                }

                setSelectedTab(id);
                handleTabRemove(index);
              }}
            >
              {title}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="tabs__content">
          {options.map(({ id, content }) => (
            <Tab.Panel key={id}>{content}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default Tabs;
