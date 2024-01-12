import { styled } from '@material-ui/core/styles';
import Page from 'components/Page';
import HomeHero from './section/HomeHero';

const RootStyle = styled(Page)({
  height: '100%'
});

const ContentStyle = styled('div')(({ theme }) => ({
  overflow: 'hidden',
  position: 'relative',
  backgroundColor: theme.palette.background.default
}));

export default function Home() {
  return (
    <RootStyle title="Real Journals: Journaling Platform" id="move_top">
      <HomeHero />
      <ContentStyle></ContentStyle>
    </RootStyle>
  );
}
