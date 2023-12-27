import UserContext from 'contexts/UserContext';
import { MAvatar } from 'components/@material-extend';
import createAvatar from 'utils/createAvatar';
import { useAuth } from 'models/Auth';

// ----------------------------------------------------------------------

export default function MyAvatar({ ...other }) {
  const { user } = useAuth();

  return (
    <MAvatar
      src={user.photo}
      alt={user.full_name}
      color={user.photo ? 'default' : createAvatar(user.full_name).color}
      {...other}
    >
      {createAvatar(user.full_name).name}
    </MAvatar>
  );
}
