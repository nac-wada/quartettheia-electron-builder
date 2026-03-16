// src/appLayout/Notification/index.tsx
import React, { useState, useEffect, memo } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Menu,
  Divider,
  MenuItem,
  Typography,
} from '@mui/material';
import Notifications from '@mui/icons-material/Notifications';

import CardTitle from '../../../components/CardTitle';
import NotificationCard from './NotificationCard';
import { useDevices } from '../../../globalContexts/DeviceContext';
import { EventType as QuartetEventType, RecordingKeyStatus, SubscribeEventResponse } from '../../../gen/quartet/v1/quartet_pb';
import { AIREAL_TOUCH_RECORDINGKEY, ApplicationMessageType, localStorage_recording_startTime, localStorage_recording_user } from '../../../types/common';
import { removeSavedLocalStorage, saveSettingsToLocalStorage } from '../../../utilities/localStorage';
import { useMessages } from '../../../globalContexts/MessagesContext';
import { ApplicationMessageEvent } from '../../../types/common';
import { useNotifications } from '../../../globalContexts/NotificationContext';
import { useQuartetSubscribeEventListener } from '../../../globalContexts/QuartetSubscribeEventContext';
import { timestampFromDate } from '@bufbuild/protobuf/wkt';
import { quartetGetRecordingKeyStatus, quartetSetSystemTime } from '../../../api/quartetAPI';

const NotificationReceive: React.FC = memo(() => {
  const { addMessage } = useMessages()
  const { updateAirealTouchRecordingStatus } = useDevices();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { notifications, removeNotifications, unreadCount, resetUnreadCount } = useNotifications()
  const open = Boolean(anchorEl);
  const { subscribeQuartetEventListener } = useQuartetSubscribeEventListener()

  const recordError: Omit<ApplicationMessageType, 'messageId'> = {
    type: ApplicationMessageEvent["RECORD_STATUS_ERROR"],
    title: 'エラー',
    content:  `
                録画状況を取得できませんでした。<br>
                アプリを再読み込みしてください
              `,
    onConfirmTitle: '閉じる',
    onConfirm: () => {}
  }

  const cameraConfigurationChange: Omit<ApplicationMessageType, 'messageId'> = {
    type: ApplicationMessageEvent["CAMERA_CONFIGURATION_CHANGE_ERROR"],
    title: '警告',
    content: `
               親カメラの構成が更新されました。<br>
               画面を更新しますか？<br>
             `,
    onConfirm: () => location.reload(),
    onCancel: () => {}
  }

  const systemTimeDrift: Omit<ApplicationMessageType, 'messageId'> = {
    type: ApplicationMessageEvent["SYSTEM_TIME_DRIFT"],
    title: '警告',
    content: `
               カメラシステムの時刻ズレを検出しました。<br>
               時刻を再設定しますか？<br>
             `,
    onConfirm: async () => {
      const now = new Date().toISOString()
      const time = timestampFromDate(new Date(now))
      // quartetBroadcastMessage({data: QuartetBroadcaseMessageType["SET_DEVICE_SYNC_TIME"]})
      quartetSetSystemTime({ time })
    },
    onCancel: () => {}
  }

  // useEffect(() => {
  //   const listener = (event: SubscribeMessageResponse) => {
  //     switch(event.data) {
  //       default:
  //         const time = new Date().toLocaleString()
  //         addNotification({ ...event, time })
  //         break;
  //     }
  //   }

  //   const unsubscribe = subscribeQuartetMessageListener(listener)

  //   return () => unsubscribe()
  // },[subscribeQuartetMessageListener])

  useEffect(() => {
    const listener = (event: SubscribeEventResponse) => {
      switch(event.type) {
        case QuartetEventType['RECORDING_STARTED']:
          const start = Date.now();
          getAirealTouchRecordingStatus(start)
          break;
        case QuartetEventType['DEVICE_CONFIGURATION_CHANGED']:
          addMessage(
            cameraConfigurationChange, 
            ApplicationMessageEvent["CAMERA_CONFIGURATION_CHANGE_ERROR"]
          )
          break;
        case QuartetEventType["SYSTEM_TIME_DRIFT"]:
          addMessage(
            systemTimeDrift,
            ApplicationMessageEvent["SYSTEM_TIME_DRIFT"]
          )
          break;
      }
    }

    const unsubscribe = subscribeQuartetEventListener(listener)

    return () => unsubscribe()
  },[subscribeQuartetEventListener])

  useEffect(() => {
    getAirealTouchRecordingStatus()
  },[])

  const getAirealTouchRecordingStatus = async (start?: number) => {
    if(start) {
      saveSettingsToLocalStorage(localStorage_recording_startTime,start);
    }
    const res = await quartetGetRecordingKeyStatus({ key: AIREAL_TOUCH_RECORDINGKEY })
    if(res) {
        updateAirealTouchRecordingStatus(res.status)

        if(res.status === RecordingKeyStatus.RECORDED || res.status === RecordingKeyStatus.NOT_EXISTS) {
          removeSavedLocalStorage(localStorage_recording_user)
          removeSavedLocalStorage(localStorage_recording_startTime)
        }
    } else {
      addMessage(recordError, ApplicationMessageEvent["SESSION_TIMEOUT_ERROR"])
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    // 未読の通知数をリセット
    resetUnreadCount()
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        title={notifications.length === 0 ? `通知がありません`:`通知`}
        onClick={handleClick}
        size="small"
        aria-controls={open ? 'account-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ mx: "0.25rem" }}
      >
        <Badge badgeContent={unreadCount} color="secondary">
          <Notifications sx={{ color: 'white', }} />
        </Badge>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            width: 'auto',
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.16))',
            mt: 1.5,
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: "85px",
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
      >
        <CardTitle title='通知欄' />
        <Divider />
        <Box component={'div'} sx={{ maxHeight: 400, minWidth: 200, overflowY: 'auto' }}>
          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              type={notification.type}
              title={notification.header}
              content={notification.data}
              time={notification.time}
            />
          ))}
        </Box>
        <Divider />
        {
          notifications.length > 0 ? (
            <MenuItem onClick={() => removeNotifications()} sx={{ justifyContent: 'end' }}>
              削除
            </MenuItem>
          ) : (
            <Typography color='text.secondary' sx={{ fontWeight: "bold", my:"0.5rem", mx: "1rem" }}>通知なし</Typography>
          )
        }
      </Menu>
    </>
  );

});

export default NotificationReceive;
