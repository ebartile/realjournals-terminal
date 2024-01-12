import { experimentalStyled as styled } from '@material-ui/core/styles';
import { OutlinedInput, Toolbar } from '@material-ui/core';

export const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
  height: 80,
  '& .MuiButton-root': {
    whiteSpace: 'nowrap'
  }
}));

export const StyledOutlinedInput = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter
  }),
  '&.Mui-focused': { width: 320, boxShadow: theme.customShadows.z8 },
  '& fieldset': {
    borderColor: `${theme.palette.grey[500_32]} !important`,
    borderWidth: `1px !important`
  }
}));
