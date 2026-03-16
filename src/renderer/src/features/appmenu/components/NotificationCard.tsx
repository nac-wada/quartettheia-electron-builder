// src/appLayout/NotificationCard.tsx
import React from 'react';
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Theme,
} from '@mui/material';
import Notifications from '@mui/icons-material/Notifications';
import Error from '@mui/icons-material/Error';
import Warning from '@mui/icons-material/Warning';
import Info from '@mui/icons-material/Info';
import NewReleases from '@mui/icons-material/NewReleases';
import GppBad from '@mui/icons-material/GppBad';
import ReportProblem from '@mui/icons-material/ReportProblem';
import Report from '@mui/icons-material/Report';
import Adb from '@mui/icons-material/Adb';
import Done from '@mui/icons-material/Done';
import Clear from '@mui/icons-material/Clear';
import Schedule from '@mui/icons-material/Schedule';
import CheckCircle from '@mui/icons-material/CheckCircle';


const NotificationUI = ({
  type,
  title,
  content,
  time,
  propTheme,
  propcolorTime,
}: {
  type: number;
  title: string;
  content: string;
  time?: string;
  propTheme?: Theme;
  propcolorTime?: string;
}) => {
  let isDriver = true;
  let icon;

  const currentTheme = useTheme();
  const theme = propTheme || currentTheme;
  const colorTime = propcolorTime || theme.palette.text.secondary;

  switch (type) {
    case -1:
      icon = <Notifications />;
      break;
    case 0:
      icon = <NewReleases />;     // MESSAGE_TYPE_UNSPECIFIED
      break;
    case 1:
      icon = <GppBad />;          // MESSAGE_TYPE_EMERGENCY
      break;
    case 2:
      icon = <ReportProblem />;   // MESSAGE_TYPE_ALERT
      break;
    case 3:
      icon = <Report />;          // MESSAGE_TYPE_CRITICAL
      break;
    case 4:
      icon = <Error sx={{ color: theme.palette.error.main, }} />;           // MESSAGE_TYPE_ERROR
      break;
    case 5:
      icon = <CheckCircle sx={{ color: theme.palette.success.main, }} />;     // MESSAGE_TYPE_SUCCESS
      break;
    case 6:
      icon = <Warning />;         // MESSAGE_TYPE_WARNING
      break;
    case 7:
      icon = <Notifications />;   // MESSAGE_TYPE_NOTICE
      break;
    case 8:
      icon = <Info />;            // MESSAGE_TYPE_INFO
      break;
    case 9:
      icon = <Adb />;             // MESSAGE_TYPE_DEBUG
      break;
    default:
      isDriver = false;
      icon = <span />;
  }


  // content内の'<成功>'のみを抽出して、'<Done/>'に置き換える(文字列のタグを展開したかったが,出来なかったので「?:」で分岐させた)
  let updatedContent = content.replace(/<成功>/g, '<Done />').replace(/<失敗>/g, '<Clear />');

  // 正規表現で <Done /> や <Clear /> といったタグを抽出する
  const tagRegex = /<(\w+)\s*\/>/g;
  const tags = updatedContent.match(tagRegex);

  // タグを除外したテキストを取得する
  const text = updatedContent.replace(tagRegex, '');

  // updatedContentを改行ごとに配列に分割する
  const contentArray = text.split('\n');
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', m: 2 }} component={'div'}>
      {icon}
      { isDriver && <Divider orientation="vertical" flexItem sx={{ mx: 1.5 }} /> }
      <Box sx={{ ml: 1 }} component={'div'}>
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>

        {contentArray.map((line, index) => (
          <React.Fragment key={index}>
            {tags?.[index] === '<Done />' ? (
              <Typography variant="body2" sx={{ mb: 0.2, color: theme.palette.text.secondary, whiteSpace: 'pre-line' }}>
                <Done sx={{ fontSize: '1rem', mb: -0.5, }} />
                {line}
              </Typography>
            ) : tags?.[index] === '<Clear />' ? (
              <Typography variant="body2" sx={{ mb: 0.2, color: theme.palette.error.main, whiteSpace: 'pre-line' }}>
                <Clear sx={{ fontSize: '1rem', mb: -0.5 }} />
                {line}
              </Typography>
            ) : (
              <Typography key={index} variant="body2" sx={{ mb: 0.2, color: theme.palette.text.secondary, whiteSpace: 'pre-line' }}>
                {line}
              </Typography>
            )}
          </React.Fragment>
        ))}

        <Typography variant="body2" sx={{ fontSize: '0.8rem', my: 0.5, ml: 0.1, color: colorTime }}>
          <Schedule sx={{ fontSize: '0.8rem', mb: -0.3, mr: 0.5, color: theme.palette.text.secondary }} />{time}
        </Typography>
      </Box>
    </Box>
  );
};

export default NotificationUI;


