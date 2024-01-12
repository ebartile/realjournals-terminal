// @mui
import { Stack, Button, Typography } from '@material-ui/core';
// assets
import { DocIllustration } from 'assets';
import { useAuth } from 'models/Auth';

// ----------------------------------------------------------------------

export default function NavbarDocs() {
  const auth = useAuth();

  return (
    <Stack spacing={3} sx={{ px: 5, pb: 5, mt: 10, width: 1, textAlign: 'center', display: 'block' }}>
      <DocIllustration sx={{ width: 1 }} />

      <div>
        <Typography gutterBottom variant="subtitle1">
          Hi, {auth.user?.full_name_display}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Need help?
          <br /> Please check our docs
        </Typography>
      </div>

      <Button href="https://docs.realjournals.com" target="_blank" rel="noopener" variant="contained">
        Documentation
      </Button>
    </Stack>
  );
}
