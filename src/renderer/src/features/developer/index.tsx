// src/components/developer/index.tsx
import {
  Typography,
  Grid,
  Container,
} from '@mui/material';
import SettingsPage from '../../features/settings/components/SettingsPage';
import SettingsPageStartup from './components/SettingsPageStartup';
import SettingsPageCalibration from './components/SettingsPageCalibration';
import { SettingsDevelopermodePage } from './components/SettingDevelopermode';
import { HiddenPageLinkList } from './components/HiddenPageLink';

const SettingsMain: React.FC = () => {

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 2, mb: 2 }}>
        <Typography variant='subtitle1' fontWeight={'bold'} sx={{ mb: 1 }} >開発者画面</Typography>

        <Grid container direction="row" spacing={2}>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <Grid container direction="column" spacing={2}>

              <Grid>
                <SettingsPageStartup />
              </Grid>
              
              <Grid>
              </Grid>

            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <Grid container direction="column" spacing={2}>

              <Grid>
                <SettingsPageCalibration />
              </Grid>
              <Grid>
              </Grid>

            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <Grid container direction="column" spacing={2}>

              <Grid>
                <SettingsPage />
              </Grid>
              <Grid>
              </Grid>
              <Grid>
              </Grid>

            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <Grid container direction="column" spacing={2}>

              <Grid>
                <SettingsDevelopermodePage />
              </Grid>
              <Grid>
              </Grid>
              <Grid>
              </Grid>

            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 12, md: 6, lg: 4, xl: 2 }}>
            <Grid container direction="column" spacing={2}>

              <Grid>
                <HiddenPageLinkList />
              </Grid>
              <Grid>
              </Grid>
              <Grid>
              </Grid>

            </Grid>
          </Grid>

        </Grid>
      </Container>

    </>
  );
};

export default SettingsMain;
