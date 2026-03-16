// src/components/deviceMonitor/TableStatistics.tsx
import React, { } from 'react';
import { useTheme } from '@mui/material/styles';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from '@mui/material';

import CardTitle from '../../../components/CardTitle';
import SaveChartAsImage from './SaveChartAsImage';
import GenerateCSV from './GenerateCSV';


interface TableStatisticsProps {
	title: string;
	camUrls: string[];
  nicknames: string[];
	data: { time: number; temperature: number; }[][];
	statistics: { minValue: number; maxValue: number; averageValue: number; currentValue: number; }[];
	colors: string[];
}

const TableStatistics: React.FC<TableStatisticsProps> = ({ title, camUrls, nicknames, data, statistics, colors }) => {
  const theme = useTheme();
	const tableCellStyle = {
		...theme.typography.body2,
		padding: '0rem',
		paddingLeft: '0.3rem',
		paddingRight: '0.3rem',
		paddingTop: '0.3rem',
		paddingBottom: '0.3rem',
	};
	// const cleanedCamUrls = camUrls.map((url) => url.replace('http://', ''));

	return (
		<>
    <div style={{ height: '100%' }}>
			<CardTitle title={title} my={'0rem'} />
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell style={tableCellStyle}></TableCell>
							<TableCell style={tableCellStyle}>min</TableCell>
							<TableCell style={tableCellStyle}>max</TableCell>
							<TableCell style={tableCellStyle}>ave</TableCell>
							<TableCell style={tableCellStyle}>now</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{nicknames.map((name, index) => (
							<TableRow key={index}>
								<TableCell style={{...tableCellStyle, color: colors[index]}}>{name}</TableCell>
								<TableCell style={tableCellStyle}>{statistics[index].minValue.toFixed(1)}</TableCell>
								<TableCell style={tableCellStyle}>{statistics[index].maxValue.toFixed(1)}</TableCell>
								<TableCell style={tableCellStyle}>{statistics[index].averageValue.toFixed(1)}</TableCell>
								<TableCell style={tableCellStyle}>{statistics[index].currentValue.toFixed(1)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<div style={{ justifyContent: 'center', display: 'flex', alignItems: 'center', marginTop: 'auto', }}>
				<Button
					onClick={() => GenerateCSV(camUrls, nicknames, data, statistics, title)}
					variant="outlined"
					sx={{ marginX: '1rem', marginTop: '2rem', fontSize: '0.rem' }}
				>
					データをCSVで保存
				</Button>

				<Button
					onClick={() => SaveChartAsImage(data, title)}
					variant="outlined"
					sx={{ marginX: '1rem', marginTop: '2rem', fontSize: '0.rem' }}
				>
					グラフをPNGで保存
				</Button>
			</div>
      </div>
		</>
	);
}

export default TableStatistics;