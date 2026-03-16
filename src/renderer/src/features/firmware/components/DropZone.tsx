import { DropZoneProps } from "../types";
import { Paper, Typography, alpha } from "@mui/material"
import { Upload } from "@mui/icons-material"
import { useRef, useState } from "react";

export const DropZone = ({ onFilesDropped, isProcessing }: DropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  // input要素に直接アクセスするための参照を作成
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    handleDrag(e);
    if (!isProcessing) setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    handleDrag(e);
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    handleDrag(e);
    setIsDragging(false);
    if (!isProcessing && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesDropped(e.dataTransfer.files);
    }
  };

  // Paperがクリックされた時にinputをクリックさせる
  const handlePaperClick = () => {
    if (!isProcessing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Paper
      variant="outlined"
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handlePaperClick} // labelの代わりにonClickで制御
      sx={{
        mt: 1,
        p: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: isProcessing ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        borderRadius: 3,
        borderStyle: 'dashed',
        borderWidth: 2,
        bgcolor: isDragging ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'background.paper',
        borderColor: isDragging ? 'primary.main' : 'divider',
        '&:hover': {
          borderColor: isProcessing ? 'divider' : 'primary.main',
          bgcolor: isProcessing ? 'background.paper' : (theme) => alpha(theme.palette.primary.main, 0.04),
        },
      }}
    >
      <input
        type="file"
        hidden
        multiple
        ref={fileInputRef} // refを割り当て
        disabled={isProcessing}
        onChange={(e) => {
          // これで確実に呼ばれるようになります
          if (e.target.files && e.target.files.length > 0) {
            onFilesDropped(e.target.files);
            e.target.value = ""; 
          }
        }}
      />
      <Upload
        color={isProcessing ? 'disabled' : 'primary'}
        sx={{ 
          fontSize: 32, 
          mb: 1, 
          transform: isDragging ? 'translateY(-4px)' : 'none', 
          transition: '0.2s',
          pointerEvents: 'none' // アイコンがクリックを邪魔しないように設定
        }}
      />
      <Typography 
        variant="body2" 
        fontWeight="bold" 
        color={isProcessing ? 'text.disabled' : 'text.primary'}
        sx={{ pointerEvents: 'none' }} // テキストがクリックを邪魔しないように設定
      >
        ファイルアップロード
      </Typography>
      <Typography 
        variant="caption" 
        color="text.secondary"
        sx={{ pointerEvents: 'none' }}
      >
        Drop or Click
      </Typography>
    </Paper>
  );
}