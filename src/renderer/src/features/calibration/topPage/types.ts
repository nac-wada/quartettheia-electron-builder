export const activeLightCalSteps = [
  {
    label: 'カメラ位置と姿勢の計算',
    description: '4つのマーカーが付いたLフレーム（Active L-Frame）を床に置くことで、空間の「原点」と「座標軸」を決定します。\n',
    navigate: '/lframe'
  },
  {
    label: 'レンズひずみの計算',
    description: '2つのマーカーが付いたTワンド(Active T-Wand)を空間内で振り回し、その軌跡を全カメラで追うことで、レンズのひずみとカメラ間の位置関係を微調整します。\n',
    navigate: '/twand'
  },
];

export const chessboardCalSteps = [
  {
    label: 'レンズひずみの計算',
    description: '様々な角度からチェスボードを撮影し、格子のゆがみを解析することでレンズのひずみを計算します。\n',
    navigate: '/iboard'
  },
  {
    label: 'カメラ位置と姿勢の計算',
    description: 'ボードを空間の基準として設置し、その見え方からカメラが「どこから」「どの向きで」撮っているかを算出します。\n',
    navigate: '/eboard'
  }
];