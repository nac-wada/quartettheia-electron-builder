import { Transport } from "@connectrpc/connect"
import { FC, memo, useEffect, useState, VideoHTMLAttributes } from "react"
import { soloConnectToLiveStream } from "../api/soloAPI";
import aireal_poster from '../assets/no_thumbnail.png'
import { Box, CircularProgress } from "@mui/material";
import { useObserverVideoSize } from "../hooks/useObserver";

export const CameraLive: FC<{ transport: Transport, videoId: string }> = memo(({ transport, videoId }) => {
  const vtagid = `live_${videoId}`
  const [ connectionState, setConnectionState ] = useState<RTCIceConnectionState>('disconnected');

  useEffect(() => {
    try {
      // シグナリングサーバー
      // WebRTC コネクション
      const pc = new RTCPeerConnection({
        // no config
      });
      const ices: string[] = [];

      pc.onicecandidate = i => {
        if (i == null) {
          return;
        }
        if (i.candidate) {
          const ice = i.candidate.toJSON();
          if (ice.candidate) {
            const j = JSON.stringify(ice);
            // console.log("onicecandidate:", j);
            ices.push(j);
          }
        }
      };

      pc.oniceconnectionstatechange = event => {
        setConnectionState(pc.iceConnectionState)
      };

      pc.onicegatheringstatechange = async event => {
        // console.log("onicegatheringstatechange:", event);
        switch (pc.iceGatheringState) {
          case 'new':
            break;
          case 'gathering':
            break;
          case 'complete':
            // ICE情報収集が完了したので接続処理をする

            const res = await soloConnectToLiveStream({ transport: transport, sdp: pc.localDescription?.sdp, ices: ices })

            if(res) {
              pc.setRemoteDescription({ type: 'answer', sdp: res.service?.sdp }).then(_ => {
                res.service?.ices.forEach(i => {
                  if(i) {
                    const j: RTCIceCandidateInit = JSON.parse(i);
                    Promise.all([pc.addIceCandidate(j)]).catch(err => {
                    });
                  }
                })
              }).catch(e => { console.error("Error:",e) })
            }

            break;
        }
      };

      pc.ondatachannel = event => {
        // console.log("ondatachannel:", event.channel.label, event.channel.id);
        event.channel.onmessage = m => {
          // console.log("message received on datachannel:", m);
        };
      };

      pc.ontrack = event => {
        if (event.track.kind === "video") {
          const element: HTMLMediaElement = document.getElementById(vtagid) as HTMLMediaElement;
          element.addEventListener("pause", () => {
            // ビューポートを離れると映像が止まるのを防止　←現状これで止まらなくなった。
            element.play()
          })
          if (element) {
            element.srcObject = event.streams[0];
          } else {
          }
        }
      };

      // connect
      pc.createDataChannel("client");
      pc.addTransceiver("video");

      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);
      });

      // componentWillUnmount
      return () => {
        // アンロード時にピアコネクションを切断
        pc?.close();
      };
    } catch (e) {
      console.log("Error:",e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ margin: 0, padding: 0, position: "relative"}}>
      {
        !(connectionState==='connected'||connectionState==='checking') &&
        <CircularProgress size={100} sx={{ color: "grey", position: "absolute", top: `calc(50% - 50px)`, left: `calc(50% - 50px)` }}/>
      }
      <video id={vtagid} autoPlay muted poster={aireal_poster} width={"100%"} height={"100%"}/>
    </div>
  )
})

export const CameraLive2: FC<{ transport: Transport, videoId: string, overlay?: React.ReactNode, videoProps?: VideoHTMLAttributes<HTMLVideoElement>}> = memo(
  ({ transport, videoId, overlay, videoProps }) => {
  const vtagid = `live_${videoId}`
  const [ connectionState, setConnectionState ] = useState<RTCIceConnectionState>('disconnected');
  const { overlayStyle, videoRef } = useObserverVideoSize()
  

  useEffect(() => {
    try {
      // シグナリングサーバー
      // WebRTC コネクション
      const pc = new RTCPeerConnection({
        // no config
      });
      const ices: string[] = [];

      pc.onicecandidate = i => {
        if (i == null) {
          return;
        }
        if (i.candidate) {
          const ice = i.candidate.toJSON();
          if (ice.candidate) {
            const j = JSON.stringify(ice);
            // console.log("onicecandidate:", j);
            ices.push(j);
          }
        }
      };

      pc.oniceconnectionstatechange = event => {
        setConnectionState(pc.iceConnectionState)
      };

      pc.onicegatheringstatechange = async event => {
        // console.log("onicegatheringstatechange:", event);
        switch (pc.iceGatheringState) {
          case 'new':
            break;
          case 'gathering':
            break;
          case 'complete':
            // ICE情報収集が完了したので接続処理をする

            const res = await soloConnectToLiveStream({ transport: transport, sdp: pc.localDescription?.sdp, ices: ices })

            if(res) {
              pc.setRemoteDescription({ type: 'answer', sdp: res.service?.sdp }).then(_ => {
                res.service?.ices.forEach(i => {
                  if(i) {
                    const j: RTCIceCandidateInit = JSON.parse(i);
                    Promise.all([pc.addIceCandidate(j)]).catch(err => {
                    });
                  }
                })
              }).catch(e => { console.error("Error:",e) })
            }

            break;
        }
      };

      pc.ondatachannel = event => {
        // console.log("ondatachannel:", event.channel.label, event.channel.id);
        event.channel.onmessage = m => {
          // console.log("message received on datachannel:", m);
        };
      };

      pc.ontrack = event => {
        if (event.track.kind === "video") {
          const element: HTMLMediaElement = document.getElementById(vtagid) as HTMLMediaElement;
          element.addEventListener("pause", () => {
            // ビューポートを離れると映像が止まるのを防止　←現状これで止まらなくなった。
            element.play()
          })
          if (element) {
            element.srcObject = event.streams[0];
          } else {
          }
        }
      };

      // connect
      pc.createDataChannel("client");
      pc.addTransceiver("video");

      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer);
      });

      // componentWillUnmount
      return () => {
        // アンロード時にピアコネクションを切断
        pc?.close();
      };
    } catch (e) {
      console.log("Error:",e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* 1. ローディング表示：最前面(zIndex: 3)に配置 */}
      {!(connectionState === 'connected' || connectionState === 'checking') && (
        <Box 
          sx={{ 
            position: "absolute",
            height: "100%", 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <CircularProgress 
            size={100} 
            sx={{ 
              color: "grey", 
              zIndex: 3 
            }}
          />
        </Box>
      )}

      {/* 2. ビデオ本体：親のサイズいっぱいに広げる */}
      <video 
        ref={videoRef}
        id={vtagid} 
        autoPlay 
        muted 
        poster={aireal_poster} 
        style={{ 
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain", // 親のaspectRatio(1936/1216)と一致させるならcoverが最適
        }}
        {...videoProps}
      />

      {
        ( overlay && videoRef.current && overlayStyle.width !== 0 && overlayStyle.height !== 0) && 
        <Box 
          sx={{ 
            position: "absolute",
            width: `${overlayStyle.width}px`,
            height: `${overlayStyle.height}px`,
            top: `${overlayStyle.top}px`,
            left: `${overlayStyle.left}px`,
            // border: "1px solid rgba(255, 255, 255, 0.5)",
            zIndex: 2,
            transition: "all 0.1s ease-out", // リサイズ時の追従を滑らかに
          }}
        >
          {overlay}
        </Box>
      }

    </>
  )
})