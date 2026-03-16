// src/components/shutdown/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  useTheme,
  Button,
  Box,
  Dialog,
  Divider,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
// import { useDevice } from '../control/ContextDevice'; // for cam urls
import { useDevices } from '../../globalContexts/DeviceContext';
import { PROGRESS_DURATION_RESTART, PROGRESS_DURATION_SHUTDOWN, keyLoginAuth } from '../../types/common';
import { Transport } from '@connectrpc/connect';
import { soloRestartDevice, soloShutDownDevice } from '../../api/soloAPI';
import { loadSettingsFromLocalStorage } from '../../utilities/localStorage';

interface DialogShutdownProps {
  open: boolean;
  onClose: () => void;
}

const DialogShutdown: React.FC<DialogShutdownProps> = ({ open, onClose }) => {
  const theme = useTheme();
  const [maxNicknameLength, setMaxNicknameLength] = useState<number>(0);                    // カメラ名の最長取得(dialogの幅用)
  const [selectedCameraIds, setSelectedCameraIds] = useState<{ip:string, transport:Transport}[]>([]);                 // カメラの選択状態
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState<boolean>(false);           // 確認ダイアログの開閉
  const [actionType, setActionType] = useState<'shutdown' | 'restart'>();                   // 実行アクションのタイプ
  const [progress, setProgress] = useState<number>(0);                                      // 進捗状況
  const [isShutdownButtonDisabled, setIsShutdownButtonDisabled] = useState<boolean>(false); // シャットダウンボタンの無効化
  const [isDialogClosing, setIsDialogClosing] = useState(false);                            // ダイアログが閉じられたことを示すフラグ
  const startTimeRef = useRef<number | undefined>();                                        // 開始時間の参照
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);                          // 進捗更新のタイマーの参照
  const KeySavedCheckbox = 'KeySavedCheckbox';
  const savedCheckbox = loadSettingsFromLocalStorage(KeySavedCheckbox, false);

  // カメラ情報をまとめる
  // const { camUrls, nicknames } = useDevice();
  const { devices } = useDevices();

  const cameras = devices.map((device,index) => {
    return {deviceId: index.toString(), label: device.nickname, ip: device.ipv4Addr, transport: device.transport}
  })

  const progressDuration = ( actionType === "shutdown" ) ? PROGRESS_DURATION_SHUTDOWN : PROGRESS_DURATION_RESTART

  // カメラ選択のトグル処理
  const toggleCameraSelection = (cam: {ip: string, transport: Transport}) => {
    // setSelectedCameraIds(prevSelectedIds => {
    //   if (prevSelectedIds.includes(deviceId)) {
    //     return prevSelectedIds.filter(id => id !== deviceId);
    //   } else {
    //     return [...prevSelectedIds, deviceId];
    //   }
    // });
    setSelectedCameraIds(prev => {
      const ips = prev.map((c) => c.ip);
      if(ips.includes(cam.ip)) {
        return prev.filter(d => d.ip !== cam.ip)
      } else {
        return [...prev, cam]
      }
    })
  };

  // アクションボタンクリック時の処理
  const handleActionClick = (action: 'shutdown' | 'restart') => {
    setActionType(action);
    setIsConfirmDialogOpen(true);
    setProgress(100);
    startTimeRef.current = Date.now();
  };

  // ダイアログを閉じる処理
  const handleClose = () => {
    setSelectedCameraIds([]);
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    onClose();
  };
  // アクション確認時の処理
  const handleConfirmAction = () => {
    const ips = selectedCameraIds.map((cam) => cam.ip);
    const existLeader = devices.filter((device) => device.primary === true)
    const selectedMasterCam = existLeader.length > 0 ? ips.includes(existLeader[0].ipv4Addr) : false
    if (actionType === 'shutdown') {
      selectedCameraIds.map(async (cam, index) => {
        // Shutdown({ solourl: id });
        const res = await soloShutDownDevice({ transport: cam.transport })
        if(res) {
          console.log('Shutdown IPaddress:', cam.ip, `(index: ${index}, id: ${cam.ip})`);
        }
        return null;
      });
      // 親カメラをシャットダウンする場合
      if(selectedMasterCam) {
        // 次回以降自動ログインしない場合
        if(!savedCheckbox) {
          // ログインの記憶情報を削除　→　次回アプリ起動時ログイン画面から
          localStorage.removeItem(keyLoginAuth);
        }
      }
    } else if (actionType === 'restart') {
      console.log('selectedCameraIds(restart)', selectedCameraIds);
      selectedCameraIds.map(async (cam, index) => {
        const res = await soloRestartDevice({ transport: cam.transport });
        // Reboot({ solourl: id });
        if(res) {
          console.log('Reboot IPaddress:', cam.ip, `(index: ${index}, id: ${cam.ip})`);
        }
        return null;
      });
      // 親カメラを再起動する場合
      if(selectedMasterCam) {
        // 次回以降自動ログインしない場合
        if(!savedCheckbox) {
          // ログインの記憶情報を削除　→　次回アプリ起動時ログイン画面から
          localStorage.removeItem(keyLoginAuth);
        }
      }
    }
    setIsShutdownButtonDisabled(true);
    setProgress(100);
    startTimeRef.current = Date.now();
    const intervalDuration = 100; // 1秒 = 1000ミリ秒なので、100ミリ秒ごとに更新

    // 進捗のインターバルを参照するためのリファレンスを設定
    progressIntervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      if (startTimeRef.current) {
        // 開始時間から経過した時間を計算
        const elapsedTime = currentTime - startTimeRef.current;
        // 残り時間を計算し、0未満にならないようにする
        const remainingTime = Math.max(progressDuration - elapsedTime, 0);
        // 残りの進捗を計算し、パーセンテージで表す
        const remainingProgress = ((remainingTime / progressDuration) * 100);
        setProgress(remainingProgress);

        if (remainingProgress <= 0) {
          if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
          onClose();
        }
      }
    }, intervalDuration);

  };

  // 確認ダイアログを閉じる処理
  const handleCloseConfirmAction = () => {
    setIsConfirmDialogOpen(false);
    setIsDialogClosing(true); // ダイアログが閉じられたことを示すフラグ
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
  };

  // ダイアログのトランジション終了(=ダイアログを閉じた)を監視
  const handleTransitionExited = () => {
    if (isDialogClosing) {       // ダイアログが完全に閉じた後の処理
      setIsShutdownButtonDisabled(false);
      setProgress(0);            // 進捗をリセット　
      setIsDialogClosing(false); // フラグをリセット
    }
  };

  // 進捗更新のタイマーをクリーンアップ
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, []);

  // 進捗が完了した場合、タイマーをクリア
  useEffect(() => {
    if (progress === 100 && progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
  }, [progress]);

  useEffect(() => {
    // 最初のダイアログを開いた時、チェックを全てつける
    if (open) {
      const allCameraIds = cameras.map(camera => { return { ip: camera.ip, transport: camera.transport} });
      setSelectedCameraIds(allCameraIds);
    }

    // ダイアログが閉じられた場合、タイマーをクリア
    if (!open && progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    // nicknames の最も長い文字列の長さを計算して設定する
    const maxLength = Math.max(...devices.map((device) => device.nickname).map(nickname => nickname.length));
    setMaxNicknameLength(maxLength);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices.map((device) => device.nickname)]);

  // アクションテキストの定義
  const actionText = actionType === 'shutdown' ? 'シャットダウン' : '再起動';

  // ボタンの無効化状態の決定
  const isButtonDisabled = selectedCameraIds.length === 0 || isShutdownButtonDisabled;

  // エラーまたは警告の色の決定
  const colorErrorOrWarning = actionType === 'shutdown' ? 'error' : 'warning';

  return (<>
    <Dialog
      open={open}
      onClose={handleClose}
      TransitionProps={{ onExited: handleTransitionExited }} // トランジション終了(ダイアログを閉じた動作)用関数
      sx={{
        maxWidth: maxNicknameLength > 0 && maxNicknameLength > 30 ? '50rem' : '30rem',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <DialogTitle>シャットダウン</DialogTitle>
      <DialogContent>
        <DialogContentText>
          カメラを選択してください。
        </DialogContentText>
        <Divider sx={{ mt: 1 }} />
        <Box sx={{ flexDirection: 'column', alignItems: 'center', p: 1, }} component={'div'}>
          <TableContainer>
            <Table>
              <TableBody>
                {cameras.map(camera => (
                  <TableRow key={camera.deviceId} sx={{ height: 40 }}>
                    <TableCell sx={{ border: 'none', py: 0, pr: 0, }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedCameraIds.map((cam) => cam.ip).includes(camera.ip)}
                            onChange={() => toggleCameraSelection({ip: camera.ip, transport: camera.transport})}
                          />
                        }
                        label={
                          <Button
                            onClick={() => toggleCameraSelection({ip: camera.ip, transport: camera.transport})}
                            sx={{
                              textTransform: 'none',
                              color: theme.palette.text.primary,
                              textAlign: 'left', // テキストを左寄せにする
                              whiteSpace: 'nowrap', // テキストの折り返しを無効化
                            }}
                          >
                            {camera.label}
                          </Button>
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ border: 'none', py: 0 , px: 0, }}>
                      <Button onClick={() => toggleCameraSelection({ip: camera.ip, transport: camera.transport})} sx={{ textTransform: 'none', color: theme.palette.text.primary, }} >
                        {camera.ip.replace(/^https?:\/\//, '')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Divider sx={{ mb: 1 }} />
        <DialogContentText>
          シャットダウンが完了すると、カメラ本体前面のステータスLEDが消灯します。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='primary'> 閉じる </Button>
        <Button onClick={() => handleActionClick('restart')}  disabled={isButtonDisabled} color='warning'> 再起動 </Button>
        <Button onClick={() => handleActionClick('shutdown')} disabled={isButtonDisabled} color='error'> シャットダウン </Button>
      </DialogActions>
    </Dialog>
    <Dialog
      open={isConfirmDialogOpen}
      onClose={handleCloseConfirmAction}
      TransitionProps={{ onExited: handleTransitionExited }} // トランジション終了(ダイアログを閉じた動作)用関数
    >
      <DialogTitle>{actionText}</DialogTitle>
      <DialogContent>
        <DialogContentText>
          { progress === 100
            ? <>本当に{actionText}しますか？</>
            : (0 < progress && progress < 100)
              ? <>{actionText}中...&emsp;残り: {Math.ceil( (( progressDuration * (progress)) / 100 ) / 1000) } 秒</>
              : <>{actionText}が完了しました。</>
          }
        </DialogContentText>
        <LinearProgress variant='determinate' value={progress} color={colorErrorOrWarning} sx={{ my: 1 }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseConfirmAction} color='primary'> {isShutdownButtonDisabled ? '閉じる' : 'いいえ'} </Button>
        <Button onClick={handleConfirmAction} disabled={isButtonDisabled} color={colorErrorOrWarning}> はい </Button>
      </DialogActions>
    </Dialog>
  </>);
};

export default DialogShutdown;
