// src\components\License\index.tsx
import { List, Typography } from '@mui/material'; // Typography をインポート
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { LicenseCard } from './components/LicenseCard';
import { AnchorLinkButton } from './components/AnchorLinkButton';

const PATH_FRONT_JSON  = "doc/license_aireal_touch/licenses_aireal_touch.json"
const PATH_BACK_JSON   = "doc/license_aireal_camera/licenses_aireal_camera.json"

export type license = {
  file: string;
  name: string;
  document: string|null;
  url: string|null;
}

type jsonformat = {
  file: string;
  title: string;
  url: string;
}


export function LicenseDocument (props: {id: number;license: license; category: string; update: any}) { // category プロパティを追加
  const markdownStyle: React.CSSProperties = {
    textAlign: 'left',
    paddingLeft: 10,
    paddingRight: 10
  };

  useEffect(() => {
    readFile(props.license, props.category) // category を readFile に渡す
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  const readFile = async (license: license, category: string) => { // readFile で category を受け取る
    if(license.document === null){
      try {
        const response = await fetch(`doc/${category}/${license.file}.md`); // ファイルパスを動的に生成
        const csvText = await response.text();
        const newobj = {
          file: license.file,
          name: license.name,
          document: csvText,
          url: license.url
        }
        props.update(newobj)
      } catch (error) {
        console.log('Error:',error)
      }
    }
  }

  return (
    <div style={markdownStyle}>
      <span style={{ fontSize: '0.8rem' }}>
        <ReactMarkdown>{ props.license.document === null ? ""  : props.license.document}</ReactMarkdown>
      </span>
    </div>
  )
}



const Text2Markdown = () => {
  const [frontLicenses, setFrontLicenses] = useState<license[]>([]);
  const [backLicenses, setBackLicenses] = useState<license[]>([]);
  const [vmocapLicenses, setVmocapLicenses] = useState<license[]>([]);
  const [frontJsonData, setFrontJsonData] = useState<jsonformat[]>();
  const [backJsonData, setBackJsonData] = useState<jsonformat[]>();

  useEffect(() => {
    const fetchLicenses = async () => {
      try {
        // front ライセンスの取得と処理
        const resA = await fetch(PATH_FRONT_JSON);
        const dataA = await resA.json();
        const frontUniqueLicenses = dataA.licenses.filter((license: jsonformat, index: number, self: jsonformat[]) =>
          index === self.findIndex((t) => t.title === license.title)
        ).sort((a: jsonformat, b: jsonformat) => {
          const titleA = a.title.toUpperCase();
          const titleB = b.title.toUpperCase();
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        });
        setFrontJsonData(frontUniqueLicenses);

        // back ライセンスの取得と処理
        const resB = await fetch(PATH_BACK_JSON);
        const dataB = await resB.json();
        const backUniqueLicenses = dataB.licenses.filter((license: jsonformat, index: number, self: jsonformat[]) =>
          index === self.findIndex((t) => t.title === license.title)
        ).sort((a: jsonformat, b: jsonformat) => {
          const titleA = a.title.toUpperCase();
          const titleB = b.title.toUpperCase();
          if (titleA < titleB) return -1;
          if (titleA > titleB) return 1;
          return 0;
        });
        setBackJsonData(backUniqueLicenses);

      } catch (error) {
        console.error("Error fetching licenses:", error);
      }
    };

    fetchLicenses();
  }, []);

  useEffect(() => {
    if (frontJsonData) {
      const frontLicenseList: license[] = frontJsonData.map((data) => ({
        file: data.file,
        name: data.title,
        document: null,
        url: data.url,
      }));
      setFrontLicenses(frontLicenseList);
    }
  }, [frontJsonData]);

  useEffect(() => {
    if (backJsonData) {
      const backLicenseList: license[] = backJsonData.map((data) => ({
        file: data.file,
        name: data.title,
        document: null,
        url: data.url,
      }));
      setBackLicenses(backLicenseList);
    }
  }, [backJsonData]);

  const update = (license: license) => {
    setFrontLicenses((e) =>
      e.map((value) => (value.file === license.file ? license : value))
    );
    setBackLicenses((e) =>
      e.map((value) => (value.file === license.file ? license : value))
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>

      <List
        sx={{
            py: 2,
            borderRadius: 5,
            width: "100%",
            maxWidth: 800,
            p: 1
          }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
          ▸ AIREAL CAMERA
        </Typography>
      </List>
      <List
        sx={{
          py: 2,
          borderRadius: 5,
          width: "100%",
          maxWidth: 800,
          bgcolor: "background.paper",
          p: 1
        }}
      >
        {backLicenses.map((license, index) => (
          <LicenseCard
            key={`${index}`}
            index={index}
            id={`${index}`}
            license={license}
            update={update}
            category={PATH_BACK_JSON.split('/')[1]}
          />
        ))}
      </List>

      <List
        sx={{
            py: 2,
            borderRadius: 5,
            width: "100%",
            maxWidth: 800,
            p: 1
          }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 2, fontWeight: 'bold' }}>
          ▸ AIREAL-Touch
        </Typography>
      </List>
      <List
        sx={{
          py: 2,
          borderRadius: 5,
          width: "100%",
          maxWidth: 800,
          bgcolor: "background.paper",
          p: 1
        }}
      >
        {frontLicenses.map((license, index) => (
          <LicenseCard
            key={`${index}`}
            index={index}
            id={`${index}`}
            license={license}
            update={update}
            category={`${PATH_FRONT_JSON}`.split('/')[1]}
          />
        ))}
      </List>
      <AnchorLinkButton link={'#App-top'} />
    </div>
  );
};

export default Text2Markdown;

