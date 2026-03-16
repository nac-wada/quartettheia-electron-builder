import { FC, Fragment, memo, useMemo, useState } from "react";
import { DeviceInfomation } from "../../../types/common";
import { useCameraVersionList } from "../hooks/useCameraVersionListState";
import { Card, Collapse, Divider, List, ListItem, ListItemText, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUp from "@mui/icons-material/KeyboardArrowUp";
import { ServiceBuildInfo } from "../../../gen/solo/v1/solo_pb";
import { CameraVersionType } from "../types";

const CameraVersionList : FC<{ devices: DeviceInfomation[] }> = memo((props) => {
  const { devices } = props;
  const cameraVersionListViewModel = useCameraVersionList({ devices: devices })
  const style = {
    fontWeight:"bold",
    fontSize: {xs : "0.8rem", sm: '1rem'},
  }

  return (
    <>
      <Card sx={{borderRadius:5,boxShadow:"none"}}>
        <List sx={{ width: '100%' }}>
          <ListItem sx={{ bgcolor: 'background.paper' }}>
            <ListItemText primary={<Typography fontSize={'1.1rem'} fontWeight='bold'>各カメラの個体情報</Typography>} />
          </ListItem>

          <Divider />

          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableCell/>
                <TableCell><Typography color={'text.secondary'} sx={{...style}}>カメラ名</Typography></TableCell>
                <TableCell><Typography color={'text.secondary'} sx={{...style}}>モデル番号</Typography></TableCell>
                <TableCell><Typography color={'text.secondary'} sx={{...style}}>シリアル番号</Typography></TableCell>
                <TableCell><Typography color={'text.secondary'} sx={{...style}}>IPアドレス</Typography></TableCell>
                <TableCell><Typography color={'text.secondary'} sx={{...style}}>MACアドレス</Typography></TableCell>
              </TableHead>

              <TableBody>
                {
                  cameraVersionListViewModel.cameraVersionListState.cameraInfos.map((cameraInfo) => (
                    <CameraInfoRow cameraInfo={cameraInfo} key={cameraInfo.ipv4Addr}/>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </List>
      </Card>

      {/* {
        cameraVersionListViewModel.cameraVersionListState.dialogProps &&
        <MessageModal message={cameraVersionListViewModel.cameraVersionListState.dialogProps}/>
      } */}
    </>
  )
})

const CameraInfoRow: FC<{ cameraInfo: CameraVersionType }> = memo((props) => {
  const { cameraInfo } = props;
  const [ open, setOpen ] = useState(false);
  const style = {
    fontWeight:"bold",
    fontSize: {xs : "0.8rem", sm: '1rem'},
  }

  return (
    <Fragment key={cameraInfo.ipv4Addr}>
      <TableRow sx={{ "& td": { borderBottom: 0 } }} onClick={() => setOpen(!open)}>
        <TableCell><Typography color={"text.secondary"} sx={{...style}}>{open ? <KeyboardArrowUp/> : <KeyboardArrowDown/>}</Typography></TableCell>
        <TableCell><Typography color={"text.secondary"} sx={{...style}}>{cameraInfo.name}</Typography></TableCell>
        <TableCell><Typography color={"text.secondary"} sx={{...style}}>{cameraInfo.model}</Typography></TableCell>
        <TableCell><Typography color={"text.secondary"} sx={{...style}}>{cameraInfo.productSerialNumber}</Typography></TableCell>
        <TableCell><Typography color={"text.secondary"} sx={{...style}}>{cameraInfo.ipv4Addr.replaceAll(`http://`,``)}</Typography></TableCell>
        <TableCell><Typography color={"text.secondary"} sx={{...style}}>{cameraInfo.macAddr}</Typography></TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout={"auto"} unmountOnExit>
            <div style={{ margin: '1rem' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><Typography color={"text.secondary"} sx={{...style}}>サービス</Typography></TableCell>
                    <TableCell><Typography color={"text.secondary"} sx={{...style}}>バージョン</Typography></TableCell>
                    <TableCell><Typography color={"text.secondary"} sx={{...style}}>リビジョン</Typography></TableCell>
                    <TableCell><Typography color={"text.secondary"} sx={{...style}}>ビルド日時</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    cameraInfo.services.map((service, index) => (
                      <ServiceInfoRow service={service} key={index}/>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
          </Collapse>
        </TableCell>
      </TableRow>
    </Fragment>
  )
})

const ServiceInfoRow: FC<{ service: ServiceBuildInfo }> = memo((props) => {
  const { service } = props;

  const tag = (!!service.buildInfo) ? service.buildInfo.tag : ""
  const hashId = (!!service.buildInfo) ? service.buildInfo.hashId : ""
  const buildTime = useMemo(() => {
    if(!!service.buildInfo && !!service.buildInfo.buildTime) {
      const buildTimeToDate = new Date(Number(service.buildInfo.buildTime.seconds)*1000)
      const year = String(buildTimeToDate.getFullYear());
      const month = String(buildTimeToDate.getMonth() + 1).padStart(2, "0");
      const date = String(buildTimeToDate.getDate()).padStart(2,"0");
      const hours = String(buildTimeToDate.getHours()).padStart(2,"0");
      const minutes = String(buildTimeToDate.getMinutes()).padStart(2,"0");
      const seconds = String(buildTimeToDate.getSeconds()).padStart(2,"0");
      return `${year}-${month}-${date} ${hours}:${minutes}:${seconds} +0000 UTC`
    } else {
      return ``
    }
  },[service.buildInfo])

  const style = {
    fontWeight:"bold",
    fontSize: {xs : "0.8rem", sm: '1rem'},
  }

  return (
    <TableRow>
      <TableCell><Typography color={"text.secondary"} sx={{...style}}>{service.serviceName}</Typography></TableCell>
      <TableCell><Typography color={"text.secondary"} sx={{...style}}>{tag}</Typography></TableCell>
      <TableCell><Typography color={"text.secondary"} sx={{...style}}>{hashId}</Typography></TableCell>
      <TableCell><Typography color={"text.secondary"} sx={{...style}}>{buildTime}</Typography></TableCell>
    </TableRow>
  )
})

export { CameraVersionList }