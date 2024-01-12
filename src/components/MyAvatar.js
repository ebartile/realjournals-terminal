import UserContext from 'contexts/UserContext';
import { MAvatar } from 'components/@material-extend';
import createAvatar from 'utils/createAvatar';
import { useAuth } from 'models/Auth';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const auth = useAuth();

  return (
    <MAvatar
      src={auth.user.photo}
      alt={auth.user.full_name_display}
      color={auth.user.photo ? 'default' : createAvatar(auth.user.full_name_display).color}
      {...other}
    >
      {createAvatar(auth.user.full_name_display).name}
    </MAvatar>
  );
}
