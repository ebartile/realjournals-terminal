import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tooltip,
  Typography
} from '@material-ui/core';
import { alpha, experimentalStyled as styled } from '@material-ui/core/styles';
import { Visibility } from '@material-ui/icons';
import { useModal } from 'utils/modal';
import UserAvatar from 'components/UserAvatar';
import User from 'models/User';
import { Icon } from '@iconify/react';
import quoteIcon from '@iconify-icons/ri/double-quotes-l';
import { defaultTo, isEmpty } from 'lodash';
import Copyable from 'components/Copyable';
import { Verified } from '@material-ui/icons';
import { Error } from '@material-ui/icons';
import ProfileLink from 'components/ProfileLink';
import { formatDateFromNow } from 'utils/formatter';
import Form, { TextField } from 'components/Form';
import { route, useFormRequest } from 'services/Http';
import { useDispatch } from 'react-redux';
import { DatePicker, LoadingButton } from '@material-ui/lab';
import { countries } from 'config';
import { timezones } from 'config';
import { continents } from 'config';
import { notify } from 'utils/index';

const UserView = ({ user }) => {
  const [modal, modalElements] = useModal();

  const showUser = useCallback(() => {
    modal.confirm({
      content: <ViewCard user={user} />,
      rootProps: { fullWidth: true },
      title: 'User Info'
    });
  }, [modal, user]);

  return (
    <Fragment>
      <IconButton onClick={showUser}>
        <Visibility />
      </IconButton>

      {modalElements}
    </Fragment>
  );
};

const ViewCard = ({ user: data }) => {
  const [user, setUser] = useState(User.use(data));

  const cover = defaultTo(user.photo, '/static/user-cover.jpg');

  return (
    <ContainerBox>
      <CardMediaStyle>
        <CoverImgStyle src={cover} />
        <ShapeAvatarBox component="span" />
        <Box
          sx={{
            zIndex: 12,
            display: 'inline-block',
            position: 'absolute',
            bottom: -34
          }}
        >
          <UserAvatar sx={{ height: 64, fontSize: 32, width: 64 }} user={user} />
        </Box>
      </CardMediaStyle>

      {user.bio && (
        <Tooltip title={user.bio}>
          <ProfileQuoteStyle>
            <Box sx={{ mr: 1 }}>
              <Icon icon={quoteIcon} width={25} height={25} />
            </Box>
            <Typography variant="body2">{user.bio}</Typography>
          </ProfileQuoteStyle>
        </Tooltip>
      )}

      <Box sx={{ mb: 5, px: 3 }}>
        <Stack alignItems="center">
          <Typography user={user} component={ProfileLink} variant="subtitle1" noWrap>
            {user.first_name}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {user.full_name_display}
          </Typography>
        </Stack>

        <Grid container spacing={2} sx={{ pt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Info title="Username" content={user.username} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <ContactInfo title="Email Address" verified={user.hasVerifiedEmail()} content={user.email} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Info title="Date of Birth" content={user.date_of_birth} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Info title="Country" content={user.country_name} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Info title="City" content={user.city} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Info title="State" content={user.state} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Info title="Continent" content={user.continent_name} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Info title="Currency" content={user.currency_name} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Info title="Timezone" content={user.timezone} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Info title="Postal Code" content={user.postal_code} />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Info title="Bio" content={user.bio} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <InfoVerified title="Is Profile Complete" verified={user.isProfileComplete()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Has atleast one account" verified={user.hasAccount()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Has atleast one account configured" verified={user.accountHasBeConfigured()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Has atleast one account configured" verified={user.accountHasBeConfigured()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Is Active" verified={user.isActive()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Is Superuser" verified={user.isSuperAdmin()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Is Staff" verified={user.isStaff()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Has Accepted Terms" verified={user.HasAcceptedTerms()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Has New Accepted Terms" verified={user.HasAcceptedNewTerms()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Enabled Two Factor" verified={user.enabledTwoFactor()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Is followable" verified={user.IsFollowable()} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InfoVerified title="Is System" verified={user.isSystem()} />
          </Grid>
        </Grid>
      </Box>

      <Divider />

      <Grid container sx={{ py: 3, px: 1, textAlign: 'center' }} spacing={2}>
        <DateInfo title="Last Login" date={user.last_login} />

        <DateInfo title="Registered" date={user.date_joined} />

        <DateInfo title="Last Seen" date={user.last_seen} />

        <DateInfo title="Last Updated" date={user.updated_at} />
      </Grid>
    </ContainerBox>
  );
};

const DateInfo = ({ title, date }) => {
  return (
    <Grid item xs={3}>
      <Typography sx={{ color: 'text.secondary', display: 'block' }} variant="caption">
        {title}
      </Typography>

      <Typography sx={{ mt: 0.5 }} variant="subtitle2" noWrap>
        {formatDateFromNow(date)}
      </Typography>
    </Grid>
  );
};

const Info = ({ title, content }) => {
  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={{ color: 'text.secondary' }} variant="caption">
          {title}
        </Typography>
      </Stack>

      {content ? (
        <Copyable variant="body2" ellipsis>
          {content}
        </Copyable>
      ) : (
        <Typography variant="body2" sx={{ lineHeight: '28px' }} noWrap>
          Unavailable
        </Typography>
      )}
    </Paper>
  );
};

const ContactInfo = ({ title, content, verified }) => {
  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={{ color: 'text.secondary' }} variant="caption">
          {title}
        </Typography>

        {verified ? <Verified color="primary" fontSize="inherit" /> : <Error color="error" fontSize="inherit" />}
      </Stack>

      {content ? (
        <Copyable variant="body2" ellipsis>
          {content}
        </Copyable>
      ) : (
        <Typography variant="body2" sx={{ lineHeight: '28px' }} noWrap>
          Unavailable
        </Typography>
      )}
    </Paper>
  );
};

const InfoVerified = ({ title, verified }) => {
  return (
    <Paper variant="outlined" sx={{ px: 2, py: 1 }}>
      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography sx={{ color: 'text.secondary' }} variant="caption">
          {title}
        </Typography>

        {verified ? <Verified color="primary" fontSize="inherit" /> : <Error color="error" fontSize="inherit" />}
      </Stack>
    </Paper>
  );
};

const ContainerBox = styled(Box)(({ theme }) => ({
  margin: theme.spacing(0, -3),
  position: 'relative'
}));

const ShapeAvatarBox = styled(Box)(({ theme }) => ({
  width: 144,
  height: 62,
  zIndex: 11,
  mask: `url(/static/icons/shape-avatar.svg) no-repeat center / contain`,
  WebkitMask: `url(/static/icons/shape-avatar.svg) no-repeat center / contain`,
  position: 'absolute',
  backgroundColor: theme.palette.background.paper,
  bottom: -26
}));

const CoverImgStyle = styled('img')({
  height: '100%',
  width: '100%',
  position: 'absolute',
  top: 0,
  objectFit: 'cover',
  zIndex: 8
});

const CardMediaStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  height: 180,
  marginBottom: 50,
  '&:before': {
    content: "''",
    position: 'absolute',
    top: 0,
    backgroundColor: alpha(theme.palette.primary.darker, 0.72),
    backdropFilter: 'blur(3px)',
    WebkitBackdropFilter: 'blur(3px)',
    width: '100%',
    zIndex: 9,
    height: '100%'
  }
}));

const ProfileQuoteStyle = styled('div')(({ theme }) => ({
  height: 130,
  overflow: 'hidden',
  color: theme.palette.common.white,
  position: 'absolute',
  top: 0,
  zIndex: 10,
  left: 0,
  padding: theme.spacing(3, 3, 0, 3),
  display: 'flex'
}));

export default UserView;
