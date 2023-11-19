import { Card } from '@material-ui/core';
import { experimentalStyled as styled } from '@material-ui/core/styles';

const ResponsiveCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  boxShadow: theme.customShadows.z12,
  overflow: 'hidden',
  '.react-grid-item &': {
    height: '100%',
    flexDirection: 'column',
    display: 'flex'
  }
}));

export default ResponsiveCard;
