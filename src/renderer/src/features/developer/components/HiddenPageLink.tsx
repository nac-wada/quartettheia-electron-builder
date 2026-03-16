import { Card, Divider, List, ListItem, ListItemText, Typography } from "@mui/material"
import SettingItem from "../../settings/components/SettingItem"

const HiddenPageLinkList = () => {

  type linkLabel = {
    title: string;
    description: string;
    link: string;
  }

  // const linkLabelList: linkLabel[] = [
  //   {
  //     title:'チュートリアル',
  //     description:'チュートリアル画面に移動',
  //     link:'gettingStarted'
  //   },
  //   {
  //     title:'バージョン',
  //     description:'バージョン画面に移動',
  //     link:'version'
  //   },
  //   {
  //     title:'デバイスモニター',
  //     description:'デバイスモニター画面に移動',
  //     link:'deviceMonitor'
  //   },
  //   {
  //     title:'カルテット',
  //     description:'カルテット画面に移動',
  //     link:'tmpQuartet'
  //   },
  //   {
  //     title:'ソロ',
  //     description:'ソロ画面に移動',
  //     link:'tmpSolo'
  //   },
  //   {
  //     title:'テスト',
  //     description:'テスト画面に移動',
  //     link:'tmpTest'
  //   },
  // ]

  const linkLabelList: linkLabel[] = [
    {
      title:'デバイスモニター',
      description:'デバイスモニター画面に移動',
      link:'deviceMonitor'
    },
  ]

  const windowOpen = (link:string) => {
    window.location.href = `./${link}`
  }

  return (
    <Card>
      <List sx={{ width: '100%'}}>
        <ListItem sx={{ bgcolor: 'background.paper' }}>
          <ListItemText
            primary={
              <Typography fontSize={'1.1rem'} fontWeight={'bold'}>リンク</Typography>
            }
          />
        </ListItem>
        <Divider/>

        {
          linkLabelList.map((linklabel,index) => (
            <SettingItem
              key={index}
              label={linklabel.title}
              labelButton="開く"
              type="button"
              description={linklabel.description}
              onClick={() => {windowOpen(linklabel.link)}}
            />
          ))
        }

      </List>
    </Card>
  )
}

export { HiddenPageLinkList }