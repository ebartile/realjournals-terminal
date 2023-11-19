import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useEffect, useState } from 'react';
import roundReceipt from '@iconify/icons-ic/round-receipt';
import roundAccountBox from '@iconify/icons-ic/round-account-box';
import { Container, Tab, Box, Tabs, Stack } from '@material-ui/core';
import FileImport from './fileImport';
import AutoImport from './autoImport';
import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

export default function ImportData() {
  const [currentTab, setCurrentTab] = useState('file');
  const dispatch = useDispatch();

  const TABS = [
    {
      value: 'file',
      icon: <Icon icon={roundAccountBox} width={20} height={20} />,
      component: <FileImport />
    },
    {
      value: 'broker sync',
      icon: <Icon icon={roundReceipt} width={20} height={20} />,
      component: <AutoImport />
    }
  ];

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  return (
    <Container>
      <Stack spacing={5}>
        <Tabs centered value={currentTab} allowScrollButtonsMobile onChange={handleChangeTab}>
          {TABS.map((tab) => (
            <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
          ))}
        </Tabs>

        {TABS.map((tab) => {
          const isMatched = tab.value === currentTab;
          return isMatched && <Box key={tab.value}>{tab.component}</Box>;
        })}
      </Stack>
    </Container>
  );
}
