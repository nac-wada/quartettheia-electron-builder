import { Box, Typography } from "@mui/material"
import { useDevices } from "../../globalContexts/DeviceContext"
import { useState } from "react";
import { MessageModalProps } from "../../types/common";
import { MessageModal } from "../../components/MessageModal";
import axios from "axios"
import { UploadTask } from "./types";
import { CameraFirmPanel } from "./components/CameraFirmPanel";

export const CameraFirm = () => {
  const { devices } = useDevices()
  const [uploadWarning, setUploadWarning] = useState<MessageModalProps | null>(null);
  const [uploadTasks, setUploadTasks] = useState<UploadTask[]>([]);

  const prepareUpload = (ipv4Addr: string, nickname: string, cameraId: string, fileList: FileList) => {
    const files = Array.from(fileList);

    const mainFile = files.find(f => f.name.endsWith('.bin'));
    const checksumFile = files.find(f => f.name.endsWith('.sha256'));

    if(files.length!==2 || !mainFile || !checksumFile) {
      setUploadWarning({
        event: "error",
        content: "更新には、.bin ファイルと .sha256 ファイルの両方が必要です。",
        onConfirmTitle: "OK",
        onConfirm: () => clearPendingFiles(),
        onClose: () => clearPendingFiles(),
      })
      return;
    }

    setUploadWarning({
      event: "warning",
      content: `
                ${nickname}のファームウェアを更新しますか？
               `,
      onConfirm: () => executeUpload(ipv4Addr, cameraId, mainFile, checksumFile),
      onClose: () => clearPendingFiles(),
      onCancel: () => clearPendingFiles()
    })
  }

  const executeUpload = (ipv4Addr: string, cameraId: string, mainFile: File, checksumFile: File) => {
    resetOldTask(cameraId)

    handleFileUpload(ipv4Addr, cameraId, mainFile, checksumFile)

    clearPendingFiles()
  }

  const handleFileUpload = async (ipv4Addr: string, cameraId: string, mainFile: File, checksumFile: File) => {
    const formData = new FormData();
    formData.append('file', mainFile);
    formData.append('checksum', checksumFile);

    // state status
    const newTask: UploadTask = { cameraId, mainFileName: mainFile.name, checksumFileName: checksumFile.name, progress: 0, status: "uploading" }
    setUploadTasks(prev => [...prev, newTask])

    try {
      await axios.post(`${ipv4Addr}:9090/upload/firmware`, formData, {
        // 進捗イベントの監視
        onUploadProgress: (ProgressEventvent) => {
          if (!ProgressEventvent.total) return; 
          const percentCompleted = Math.round(
            (ProgressEventvent.loaded * 100) / ProgressEventvent.total
          );
          // state progress
          console.log(percentCompleted)
          setUploadTasks(prev => prev.map(t => t.cameraId===cameraId ? { ...t, progress: percentCompleted } : t))
        },
        timeout: 0
      });
      
      // state status
      setUploadTasks(prev => prev.map(t => t.cameraId===cameraId ? { ...t, status: "completed" } : t))
    } catch (error) {
      // state status
      setUploadTasks(prev => prev.map(t => t.cameraId===cameraId ? { ...t, status: "error" } : t))
      console.error(error)
    }
  }

  const clearPendingFiles = () => {
    setUploadWarning(null);
  }

  const resetOldTask = (cameraId: string) => {
    setUploadTasks(prev => prev.filter(prevTask => prevTask.cameraId !== cameraId))
  }
  
  return (
    <>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
              Camera Management
            </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", mb: "20px" }}>
          <Typography variant="body2" color="textSecondary">{"➀ファームウェア更新用ファイル（.bin / .sha256）をドラッグアンドドロップまたは選択してアップロードしてください。"}</Typography>
          <Typography variant="body2" color="textSecondary">{"➁「ファームウェアを更新しますか？」と表示されたら「はい」を押してファームウェアを更新してください。\n※更新中はブラウザをリロードしないでください。"}</Typography>
          <Typography variant="body2" color="textSecondary">{"➂ファームウェアの更新が完了するとカメラが再起動します。"}</Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(1, 1fr)", md: `repeat(2, 1fr)`}, gap: "10px" }}>
        {
          devices.map((camera) => {
            const tasks = uploadTasks.filter(t => t.cameraId === camera.id);
            const isProcessing = tasks.some(t => t.status === 'uploading');
            return (
              <CameraFirmPanel 
                camera={{ 
                  id: camera.id, 
                  nickname: camera.nickname, 
                  ipv4Addr: camera.ipv4Addr, 
                  primary: camera.primary 
                }}
                isProcessing={isProcessing}
                tasks={tasks}
                prepareUpload={prepareUpload}
              />
            )
          })
        }
        </Box>
      </Box>

      { uploadWarning && <MessageModal message={uploadWarning}/> }
    </>
  )
}
