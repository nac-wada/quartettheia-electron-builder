// Live.tsx
import { useEffect } from "react";
import { SoloService } from "../gen/solo/v1/solo_pb";
import { createClient } from '@connectrpc/connect';
import { createConnectTransport } from '@connectrpc/connect-web';
import poster from '../../poster.png';
import { v4 as uuidv4 } from 'uuid';

export default function Live(props: { sigurl: string; }) {

  // video-tag id
  const vtagid = uuidv4();

  useEffect(() => {

    // シグナリングサーバー
    const soloTransport = createConnectTransport({
      baseUrl: props?.sigurl
    });
    const soloclient = createClient(SoloService, soloTransport);

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
          console.log("onicecandidate:", j);
          ices.push(j);
        }

        const js = JSON.stringify(ice);
        console.log("onicecandidate+:", js);
      }
    };
    pc.onicecandidateerror = event => {
      console.log("onicecandidateerror:", event);
    };
    pc.oniceconnectionstatechange = event => {
      console.log("oniceconnectionstatechange:", event);
    };
    pc.onicegatheringstatechange = event => {
      console.log("onicegatheringstatechange:", event);
      switch (pc.iceGatheringState) {
        case 'new':
          console.log("=> new");
          break;
        case 'gathering':
          console.log("=> gathering");
          break;
        case 'complete':
          // ICE情報収集が完了したので接続処理をする
          console.log("=> complete");
          console.log(ices);
          //
          soloclient.connectToLiveStream({ client: { sdp: pc.localDescription?.sdp, ices: ices } }).then(s => {
            pc.setRemoteDescription({ type: 'answer', sdp: s?.service?.sdp }).then(_ => {
              //let idx: number = 0;
              s.service?.ices.forEach(i => {
                if (i) {
                  const j: RTCIceCandidateInit = JSON.parse(i);
                  console.log("[ice]", j);
                  Promise.all([pc.addIceCandidate(j)]).catch(err => {
                    console.log("[error]", err);
                  });
                }
                //idx++;
              });
            });
          });
          break;
      }
    };

    pc.ondatachannel = event => {
      console.log("ondatachannel:", event.channel.label, event.channel.id);
      event.channel.onmessage = m => {
        //console.log("message received on datachannel:", m);
      };
    };

    pc.ontrack = event => {
      console.log("[event] ontrack:", event.track.kind, event.track.id, event.streams[0].id);
      if (event.track.kind === "video") {
        const element: HTMLMediaElement = document.getElementById(vtagid) as HTMLMediaElement;
        if (element) {
          element.srcObject = event.streams[0];
        } else {
          console.log("video-component not found in this page");
        }
      }
    };

    // connect
    pc.createDataChannel("client");
    pc.addTransceiver("video");

    pc.createOffer().then(offer => {
      pc.setLocalDescription(offer);
    });

    // componentDidMount
    // ...
    return () => {
      // componentWillUnmount

      // アンロード時にピアコネクションを切断
      pc?.close();
    };
  });

  return (
    <video id={vtagid} autoPlay muted width={484} height={304} poster={poster} />
  );
}