// src/components/deviceMonitor/PlotGraph.tsx
import React, { } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from 'recharts';
import CardTitle from '../../../components/CardTitle';


interface PlotGraphProps {
	title: string;
	camUrls: string[];
  nicknames: string[];
	data: any[];
	colors: string[];
	maxTime: Date;
}

const PlotGraph: React.FC<PlotGraphProps> = ({ title, camUrls, nicknames, data, colors, maxTime}) => {
	const theme = useTheme();
	return (<>
        <CardTitle title={title} my={'0rem'} />
        <ResponsiveContainer id={title.replace(/\s+/g, '_')} >
            <LineChart>
                <XAxis
                    dataKey="time"
                    domain={[data[0][0], maxTime.getTime()]}
                    tickFormatter={(unixTime) =>
                        new Date(unixTime).toLocaleTimeString([], {
                            hour:   '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        })
                    }
                    type="number"
                    stroke={theme.palette.text.secondary}
                />
                <YAxis
                    stroke={theme.palette.text.secondary}
                    style={theme.typography.body2}
                >
                    <Label
                        angle={270}
                        position="left"
                        offset={-12}
                        style={{
                            textAnchor: 'middle',
                            fill: theme.palette.text.primary,
                            ...theme.typography.body1,
                        }}
                    >
                        Temperature [°C]
                    </Label>
                </YAxis>
                <CartesianGrid stroke="#f5f5f5" />
                <Tooltip
                    labelFormatter={(value: number) => {
                        const date    = new Date(value);
                        const hours   = date.getHours().toString().padStart(2, '0');
                        const minutes = date.getMinutes().toString().padStart(2, '0');
                        const seconds = date.getSeconds().toString().padStart(2, '0');
                        return `${hours}:${minutes}:${seconds}`;
                    }}
                    formatter={(value: number) => value.toFixed(2)}
                    contentStyle={{
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        border: 'none',
                    }}
                />
                <Legend
                    verticalAlign="top"
                    margin={{ top: 20 }}
                    payload={camUrls.map((url, index) => ({
                        value: nicknames[index],
                        type: 'line',
                        id: `${nicknames[index]}`,
                        color: colors[index],
                    }))}
                    //payload={camUrls.map((url, index) => ({
                    //	value: url.replace('http://', ''),
                    //	type: 'line',
                    //	id: `${url}`,
                    //	color: colors[index],
                    //}))}
                />

                {camUrls.map((url, index) => (
                    <Line
                        key={`Line_${index}_${nicknames[index]}`}
                        type="linear"
                        data={data[index]}
                        dataKey={`temperature`}
                        stroke={colors[index]}
                        name={`${nicknames[index]}`}
                        isAnimationActive={false}
                        dot={false}
                    />
                ))}
                {/*{camUrls.map((url, index) => (
                    <Line
                        key={index}
                        type="linear"
                        data={data[index]}
                        dataKey={`temperature`}
                        stroke={colors[index]}
                        name={`${url}`}
                        isAnimationActive={false}
                        dot={false}
                    />
                ))}*/}
            </LineChart>
        </ResponsiveContainer>
    </>);
}


export default PlotGraph;