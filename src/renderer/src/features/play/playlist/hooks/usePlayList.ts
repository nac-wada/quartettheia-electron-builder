import { useCallback, useEffect, useState } from "react";
import no_thumbnail_poster from "../../../../assets/no_thumbnail.png"
import { VideoGroupType, VideoType } from "../../../../types/common";
import { useDevices } from "../../../../globalContexts/DeviceContext";
import { EventType, FileMetadataType, SubscribeEventResponse } from "../../../../gen/solo/v1/solo_pb";
import { useSoloSubscribeEventListener } from "../../../../globalContexts/SoloSubscribeEventContext";
import { soloSetRecordedFileMetadata } from "../../../../api/soloAPI";
import { downloadMp4 } from "../utils/download";
import { quartetGetRecordedKeyFileGroupsCount, quartetGetRecordedKeyFileGroupsWithMetadatas, quartetRemoveRecordedKeyFileGroup, quartetRemoveRecordedKeyFileGroups } from "../../../../api/quartetAPI";
import { changeOrderType, closeHandleSortMenuType, closeReplayFormFunc, closeWarningDialogFuncType, downloadMp4FileFuncType, downloadRecordedKeyFileGroupFuncType, downloadRecordedKeyFileGroupsFuncType, getRecordedKeyFileGroupsWithMetadatasFuncType, openHandleSortMenuType, openReplayFormFuncType, openWarningDialogFuncType, PlayListModel, PlayListViewModel, removeRecordedKeyFileGroupFuncType, removeRecordedKeyFileGroupsFuncType, selectAllRecordedKeyFileGroupsFuncType, selectRecordedKeyFileGroupFuncType, setRecordedFileMetadataFuncType, stopDownloadRecordedKeyFileGroupFuncType } from "../../common";

const usePlayList = ({ count }:{ count: number }): PlayListViewModel => {
  const { devices } = useDevices()
  const { subscribeSoloEventListener } = useSoloSubscribeEventListener()
  const [ listState, setPlayListModelState ] = useState<PlayListModel>({
    items: [], 
    moreItemsLoading: false, 
    startIndex: 0, 
    order: 4, 
    fileCount: 0,
    activeItem: null,
    dialogProps: null,
    sortMenuAnchor: null,
    listUpdated: false
  })

  useEffect(() => {
    
    getRecordedKeyFileGroupsWithMetadatasFunc({ startIndex: 0, order: 4, getFiles: count, event: `setUp` })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  useEffect(() => {
    const subscribeList = new Set<() => void>();
    if(devices.length) {

      devices.map(({ipv4Addr}) => {
        const listener = (event:SubscribeEventResponse) => {
          if(event.type===EventType["RECORD_CREATED"] || event.type===EventType["RECORD_REMOVED"]) {
            setPlayListModelState((prev) => ({...prev, listUpdated: true}))
          }
        }

        const unsubsribe = subscribeSoloEventListener(ipv4Addr, listener)

        subscribeList.add(unsubsribe)
      })
    }

    return () => {
      subscribeList.forEach(subscribe => subscribe())
    }
  },[subscribeSoloEventListener])

  useEffect(() => {
    if(listState.listUpdated && listState.activeItem===null) {
      // 更新があること　かつ　再生画面を開いていない場合にレンダリングする. 再生画面が閉じられたらレンダリングされる
      getRecordedKeyFileGroupsWithMetadatasFunc({ 
        startIndex: 0, 
        order: 4, 
        getFiles: count,
        event: `reload` 
      })
      
      // 更新完了後、フラグをfalseに
      setPlayListModelState(prev => ({...prev, listUpdated: false}))
    }
  },[listState.listUpdated, listState.activeItem])

  const getRecordedKeyFileGroupsWithMetadatasFunc: getRecordedKeyFileGroupsWithMetadatasFuncType = useCallback(
    async ({
      startIndex, order, getFiles, event, toTop
    }) => {
      try {
        setPlayListModelState((prev) => ({...prev, moreItemsLoading: true }));

        const groupsCount_res = await quartetGetRecordedKeyFileGroupsCount();

        if(groupsCount_res) {
          if(groupsCount_res.count === 0) {
            setPlayListModelState((prev) => ({
              ...prev,
              moreItemsLoading: false,
              fileCount: groupsCount_res.count,
              items: []
            }))
          } else if(groupsCount_res.count > startIndex) {
            setPlayListModelState((prev) => ({
              ...prev,
              fileCount: groupsCount_res.count 
            }))

            const metadatas_res = await quartetGetRecordedKeyFileGroupsWithMetadatas({ order: order, startIndex: startIndex, countFiles: getFiles })
            
            if(metadatas_res) {
              const videoGroups: VideoGroupType[] = await Promise.all(metadatas_res.groups.map(async ({files, key}, index) => {
                const fileDatas: VideoType[] = await Promise.all(files.map(async (
                  {thumbnail, preview, name, ipv4Addr, createTime, size, sceneName, subjectId, tag, hasFrameDrops, hasUnstableSyncFrames }, _index
                ) => {
                  let _thumbnail;
                  let _preview;
                  const encode = encodeURIComponent("#");
                  if(thumbnail === "") {
                    _thumbnail = no_thumbnail_poster
                  } else {
                    const thumbSrcName = thumbnail.replaceAll("#", encode);
                    _thumbnail = `http://${ipv4Addr}:9090/files/records/${thumbSrcName}`
                  }
                  if(preview === "") {
                    _preview = ""
                  } else {
                    const preSrcName = preview.replaceAll("#",encode);
                    _preview = `http://${ipv4Addr}:9090/files/records/${preSrcName}`
                  }
                  const _name = name.replaceAll("#", encode);
                  const _device = devices.filter((d) => d.ipv4Addr.replace(/^https?:\/\//,'') === ipv4Addr)[0];
                  const nickname = _device.nickname;
                  const transport = _device.transport;
                  const _src = `http://${ipv4Addr}:9090/files/records/${_name}`
                  return {
                    cameraid: _index,
                    nickname: nickname,
                    transport: transport,
                    ipv4Addr: ipv4Addr,
                    name: _name,
                    src: _src,
                    rawSrc: name,
                    createTime: createTime,
                    size: size,
                    thumbnail: _thumbnail,
                    preview: _preview,
                    sceneName: sceneName,
                    subjectId: subjectId,
                    tag: tag,
                    loaded: 0,
                    hasFrameDrops: hasFrameDrops,
                    hasUnstableSyncFrames: hasUnstableSyncFrames,
                    downloadMp4: () => downloadMp4FileFunc({ date: new Date(Number(fileDatas[0].createTime?.seconds)*1000), src: _src, nickname: nickname, sceneName, subjectId })
                  }
                }))

                return {
                  key: key,
                  date: new Date(Number(fileDatas[0].createTime?.seconds)*1000),
                  video: fileDatas,
                  bytes: Math.round(fileDatas.reduce(function (sum, el) {return sum + Number(el.size)},0)/1000000),
                  selected: false,
                  updatingSceneName: false,
                  updatingSubjectId: false,
                  downloading: false,
                  removing: false,
                  fetchController: null
                }
              }))
              // プレイリストが初期状態のときそのまま追加
              if(startIndex === 0) {
                setPlayListModelState((prev) => ({
                  ...prev,
                  items: videoGroups,
                }))
              }
              else {
                setPlayListModelState((prev) => ({
                  ...prev,
                  items: prev.items.concat(videoGroups)
                }))
              }

              // リスト追加後ローディングをfalse、次に追加するときの番号を更新
              setPlayListModelState((prev) => ({
                ...prev,
                startIndex: startIndex + getFiles,
                moreItemsLoading: false,
              }))
            } else {
              // ダイアログ追加
              setPlayListModelState((prev) => ({
                ...prev,
                moreItemsLoading: false
              }))

              return;
            }
          }
        } else {
          // ダイアログ追加
          setPlayListModelState((prev) => ({
            ...prev,
            moreItemsLoading: false
          }))

          return;
        }
      } catch (e) {
        console.log(e)
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // クリックしたリスト項目を選択状態にする。または外す
  const selectRecordedKeyFileGroupFunc: selectRecordedKeyFileGroupFuncType = useCallback(({ item }) => {

    setPlayListModelState((prev) => ({
      ...prev,
      items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
             {
              ...prevItem,
              selected: prevItem.selected ? false : true,
             } : prevItem
      )
    }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // リストすべての項目を選択状態にする。または外す
  const selectAllRecordedKeyFileGroupsFunc: selectAllRecordedKeyFileGroupsFuncType = useCallback(() => {

    setPlayListModelState((prev) => ({
      ...prev,
      items: prev.items.length !== 0 && (prev.items.length === prev.items.filter((item) => item.selected === true).length)
             ? prev.items.map((prevItem) => ({...prevItem, selected: false}))
             : prev.items.map((prevItem) => ({...prevItem, selected: true}))
    }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // クリックしたレコードを再生画面に表示する。
  const openReplayFormFunc: openReplayFormFuncType = useCallback(({ itemKey }) => {
    try {
      setPlayListModelState((prev) => ({ ...prev, activeItem: itemKey }))
    } catch (e) {
      console.log(e)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  //再生画面を閉じる
  const closeReplayFormFunc: closeReplayFormFunc = useCallback(() => {
    try {
      setPlayListModelState((prev) => ({
        ...prev,
        activeItem: null
      }))
    } catch (e) {
      console.log(e)
    }
  },[])

  // ダイアログのタイプをセットする。　開く
  const openWarningDialogFunc: openWarningDialogFuncType = useCallback(({ dialog }) => {
    setPlayListModelState((prev) => ({
      ...prev,
      dialogProps: dialog
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // ダイアログを閉じる
  const closeWarningDialogFunc: closeWarningDialogFuncType = useCallback(() => {
    setPlayListModelState((prev) => ({
      ...prev,
      dialogProps: null
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // クリックしたリストの項目を削除する
  const removeRecordedKeyFileGroupFunc: removeRecordedKeyFileGroupFuncType = useCallback( async({ item }) => {
    try {
      const res = await quartetRemoveRecordedKeyFileGroup({ key: item.key })

      if(res) {
     
        setPlayListModelState((prev) => ({
          ...prev,
          items: prev.items.filter((value) => value !== item)
        }))
      } else {
        // ダイアログ追加
      }
    } catch {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // 選択状態のリスト項目をすべて削除する
  const removeRecordedKeyFileGroupsFunc: removeRecordedKeyFileGroupsFuncType = useCallback( async({ items }) => {
    try {
      const res = await quartetRemoveRecordedKeyFileGroups({ keys: items.map(({key}) => key) })

      if(res) {

        setPlayListModelState((prev) => ({
          ...prev,
          items: prev.items.filter((value) => items.includes(value) === false),
        }))

      } else {
        // ダイアログ追加
      }
    } catch {

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const setRecordedFileMetadataFunc: setRecordedFileMetadataFuncType = useCallback( async({ value, item, fileMetaDataType}) => {
    switch (fileMetaDataType) {
      case FileMetadataType.SCENE_NAME: 
        setPlayListModelState((prev) => ({
          ...prev,
          items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
                {
                    ...prevItem,
                    updatingSceneName: true,
                } : prevItem)
        }))
    
        await Promise.all(
          item.video.map(async (file) => {
            try {
              const res = await soloSetRecordedFileMetadata({ transport: file.transport, fileName: file.rawSrc, metadata: { type: FileMetadataType.SCENE_NAME, data: value } })
              
              if(res) {
                setPlayListModelState((prev) => ({
                  ...prev,
                  items: prev.items.map((prevItem) => (prevItem.key === item.key ?
                    {
                      ...prevItem, 
                      video: prevItem.video.map((_file) => (_file.ipv4Addr === file.ipv4Addr ?
                      { 
                        ..._file, 
                        sceneName: value ,
                        downloadMp4: () => downloadMp4FileFunc({ date: prevItem.date, src: _file.src, nickname: _file.nickname, sceneName: value, subjectId: _file.subjectId })
                      } : _file))
                    } : prevItem
                  ))
                }))
              } else {
                setPlayListModelState((prev) => ({
                  ...prev,
                  items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
                        {
                            ...prevItem,
                            updatingSceneName: false
                        } : prevItem)
                }))
                return;  
              }
    
            } catch (e) {
              setPlayListModelState((prev) => ({
                ...prev,
                items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
                      {
                          ...prevItem,
                          updatingSceneName: false
                      } : prevItem)
              }))
              return;
            }    
          })
        )
    
        setPlayListModelState((prev) => ({
          ...prev,
          items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
                {
                    ...prevItem,
                    updatingSceneName: false
                } : prevItem)
        }))
        break;
      case FileMetadataType.SUBJECT_ID:
        setPlayListModelState((prev) => ({
          ...prev,
          items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
                 {
                    ...prevItem,
                    updatingSubjectId: true
                 } : prevItem
        )
        }))
    
        await Promise.all(
          item.video.map(async (file) => {
            try {
              const res = await soloSetRecordedFileMetadata({ transport: file.transport, fileName: file.rawSrc, metadata: { type: FileMetadataType.SUBJECT_ID, data: value } })
              
              if(res) {
                setPlayListModelState((prev) => ({
                  ...prev,
                  items: prev.items.map((prevItem) => (prevItem.key === item.key ?
                    {...prevItem, video: prevItem.video.map((_file) => (
                      _file.ipv4Addr === file.ipv4Addr ?
                      { 
                        ..._file, 
                        subjectId: value,
                        downloadMp4: () => downloadMp4FileFunc({ date: prevItem.date, src: _file.src, nickname: _file.nickname, sceneName: _file.sceneName, subjectId: value }) 
                      } : _file))
                    } : prevItem
                  ))
                }))
              } else {
                setPlayListModelState((prev) => ({
                  ...prev,
                  items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
                        {
                            ...prevItem,
                            updatingSubjectId: false
                        } : prevItem)
                }))
                return;  
              }
    
            } catch (e) {
              setPlayListModelState((prev) => ({
                ...prev,
                items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
                      {
                          ...prevItem,
                          updatingSubjectId: false
                      } : prevItem)
              }))
              return;
            }    
          })
        )
    
        setPlayListModelState((prev) => ({
          ...prev,
          items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
                 {
                    ...prevItem,
                    updatingSubjectId: false
                 } : prevItem)
        }))
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const downloadMp4FileFunc: downloadMp4FileFuncType = useCallback(async ({ date, sceneName, subjectId, nickname, src, signal, onProgress }) => {
    const year = String(date.getFullYear());
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hour = String(date.getHours()).padStart(2, "0")
    const minute = String(date.getMinutes()).padStart(2, "0")
    const second = String(date.getSeconds()).padStart(2, "0")
    const dateToString = `${year}-${month}-${day}_${hour}-${minute}-${second}`
    const outputFileName = `${sceneName}_${subjectId}_${dateToString}_${nickname}.mp4`;
    // ダウンロード処理
    const response = await downloadMp4({src,signal,outputFileName,onProgress})
    return response
  },[])

  // クリックしたリスト項目をダウンロードする
  const downloadRecordedKeyFileGroupFunc: downloadRecordedKeyFileGroupFuncType = useCallback(async ({ item }) => {
    const fetchController = new AbortController()

    setPlayListModelState((prev) => ({
      ...prev,
      items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
              {
                ...prevItem, 
                downloading: true,
                fetchController,
              } : prevItem
      )
    }))

    await Promise.all(
      item.video.map(async ({src, ipv4Addr, nickname, sceneName, subjectId}, _) => {
        
        // 進捗更新
        function onProgress(loaded: number){
          setPlayListModelState((prev) => ({
            ...prev,
            items: prev.items.map((prevItem) => (prevItem.key === item.key) ?
              { ...prevItem, video: prevItem.video.map((_file) => (
                _file.ipv4Addr === ipv4Addr ?
                { ..._file, loaded: loaded } : _file
              )) } : prevItem
            )
          }))
        }

        const result = downloadMp4FileFunc({date: item.date, signal: fetchController.signal, src, nickname, sceneName, subjectId, onProgress})
        return result
      })
    )

    setPlayListModelState((prev) => ({
      ...prev,
      items: prev.items.map((prevItem) => (prevItem.key === item.key ?
        {
          ...prevItem,
          downloading: false,
          video: prevItem.video.map((_file) => (
            {
              ..._file, 
              loaded: 0 
            }
          ))
        } : prevItem
      ))
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // 選択状態のリスト項目をすべてダウンロードする
  const downloadRecordedKeyFileGroupsFunc: downloadRecordedKeyFileGroupsFuncType = useCallback(async ({ items }) => {

    items.map((async (item) => {
        downloadRecordedKeyFileGroupFunc({ item: item })
    }))

    setPlayListModelState((prev) => ({
      ...prev,
      items: prev.items.map((item) => ({...item, selected: false}))
    }))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // ダウンロードを停止する
  const stopDownloadRecordedKeyFileGroupFunc: stopDownloadRecordedKeyFileGroupFuncType = useCallback(({ item }) => {
    if(item.fetchController) {
      item.fetchController.abort(
      setPlayListModelState((prev) => ({
        ...prev,
        items: prev.items.map((prevItem) => (prevItem.key === item.key ?
          {
            ...prevItem,
            downloading: false,
            video: prevItem.video.map((_file) => (
              {
                ..._file,
                loaded: 0,
              }
            ))
          } : prevItem
        ))
      }))
    )
    }
  },[])

  // リストの順番を変更する
  const changeOrder: changeOrderType = useCallback(({ requestOrder }) => {
    setPlayListModelState((prev) => ({
      ...prev,
      order: requestOrder
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // リスト順を変更するメニューを開く
  const openHandleSortMenu: openHandleSortMenuType = useCallback((event) => {
    setPlayListModelState((prev) => ({
      ...prev,
      sortMenuAnchor: event.currentTarget
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // ソートメニューを閉じる
  const closeHandleSortMenu: closeHandleSortMenuType = useCallback(() => {
    setPlayListModelState((prev) => ({
      ...prev,
      sortMenuAnchor: null
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return { 
    listState,  
    getRecordedKeyFileGroupsWithMetadatasFunc,
    changeOrder,
    openReplayFormFunc,
    closeReplayFormFunc,
    openWarningDialogFunc,
    closeWarningDialogFunc,
    selectRecordedKeyFileGroupFunc,
    selectAllRecordedKeyFileGroupsFunc,
    removeRecordedKeyFileGroupFunc,
    removeRecordedKeyFileGroupsFunc,
    setRecordedFileMetadataFunc,
    downloadMp4FileFunc,
    downloadRecordedKeyFileGroupFunc,
    downloadRecordedKeyFileGroupsFunc,
    stopDownloadRecordedKeyFileGroupFunc,
    openHandleSortMenu,
    closeHandleSortMenu,
  }
}

export { usePlayList }