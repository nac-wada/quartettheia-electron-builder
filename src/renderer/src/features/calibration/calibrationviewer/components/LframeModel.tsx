import { FC, memo, useMemo } from "react"
import { FBX_FILE_LIST } from "../types"
import { ScaledFbxModel } from "./ModelFbx"

const LframeModel: FC<{ markers: 5 | 4 }> = memo(({ markers }) => {
  const options = useMemo(() => {

    if(markers===4) {
      return {
        Scale: 0.5,
        Pos: { x: 0, y: 0, z: 0 },
        Rot: { x: 90, y: -90, z: 0 },
      }
    } else {
      return {
        Scale: 0.5,
        Pos: { x: 0.475, y: 0, z: 0 },
        Rot: { x: 90, y: 0, z: 0 },
      }
    }
  }, [markers])

  return (
    <ScaledFbxModel
      path={FBX_FILE_LIST[1]}
      scales={[options['Scale'], options['Scale'], options['Scale']]}
      position={[options['Pos'].x, options['Pos'].y, options['Pos'].z]}
      rotation={[options['Rot'].x, options['Rot'].y, options['Rot'].z]}
    />
  )
})

export { LframeModel }