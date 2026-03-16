import { Transport } from "@connectrpc/connect";
import { soloGetCameraExposure, soloGetCameraGain, soloGetCameraGamma, soloGetCameraWhiteBalanceBlue, soloGetCameraWhiteBalanceRed, soloSetCameraExposure, soloSetCameraGain, soloSetCameraGamma, soloSetCameraWhiteBalanceBlue, soloSetCameraWhiteBalanceRed } from "../../../../api/soloAPI";

export const resetCameraParameter = async ({ transport }:{ transport: Transport }) => {
  const exposure = await soloGetCameraExposure({ transport });
  const gain = await soloGetCameraGain({ transport });
  const gamma = await soloGetCameraGamma({ transport });
  const wb = await soloGetCameraWhiteBalanceBlue({ transport });
  const wr = await soloGetCameraWhiteBalanceRed({ transport });

  if(exposure) soloSetCameraExposure({ transport, value: exposure.defaultValue })
  if(gain) soloSetCameraGain({ transport, value: gain.defaultValue })
  if(gamma) soloSetCameraGamma({ transport, value: gamma.defaultValue })
  if(wb) soloSetCameraWhiteBalanceBlue({ transport, value: wb.defaultValue })
  if(wr) soloSetCameraWhiteBalanceRed({ transport, value: wr.defaultValue })
}