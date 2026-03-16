// src/components/settings/index.tsx
//import React, { useState } from 'react';
import {
  Grid,
  Container,
} from '@mui/material';
import SettingsPageReset from './components/SettingsPageReset';
import SettingsPagePW from './components/SettingsPagePW';
import { SettingChangeContainer } from './components/SettingPageChange';

const SettingsMain: React.FC = () => {

  return (
    <>
      <Container maxWidth="xl" sx={{  }}>

        <Grid container direction="row" spacing={2}>

          <Grid size={{ xs: 12 }}>
            <Grid container direction="column" spacing={2}>

              <Grid>
                <SettingsPagePW />
              </Grid>

              <Grid>
                <SettingsPageReset />
              </Grid>

              <Grid>
                <SettingChangeContainer/>
              </Grid>

            </Grid>
          </Grid>

        </Grid>
      </Container>

    </>
  );
};

export default SettingsMain;
