import { FC, memo } from "react"
import { FBX_FILE_LIST } from "../types"
import { ScaledFbxModel } from "./ModelFbx"

const ChessboardModel: FC = memo(() => {
  const options = {
    Scale: 1,
    Pos: { x: 0, y: 0, z: 0 },
    Rot: { x: 0, y: 0, z: 0 },
  }

  return (
    <ScaledFbxModel
      path={FBX_FILE_LIST[0]}
      scales={[options['Scale'], options['Scale'], options['Scale']]}
      position={[options['Pos'].x, options['Pos'].y, options['Pos'].z]}
      rotation={[options['Rot'].x, options['Rot'].y, options['Rot'].z]}
    />
  )
})

export { ChessboardModel }