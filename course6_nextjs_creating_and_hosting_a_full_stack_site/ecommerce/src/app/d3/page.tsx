'use client';

import * as d3 from "d3";
import { useEffect, useState } from 'react';

interface LinePlotProps {
    width?: number;
    height?: number;
    marginTop?: number;
    marginRight?: number;
    marginBottom?: number;
    marginLeft?: number;
}

export default function D3Page() {
    const [data, setData] = useState<number[]>([]);

    useEffect(() => {
        // Simulating data fetching or generation
        const sampleData = [10, 25, 15, 30, 20, 35, 40, 28, 50, 45];
        setData(sampleData);
    }, []);

    return (
        <div>
            <h1>D3 Line Plot</h1>
            <LinePlot data={data} />
        </div>
    );
}

function LinePlot({
                      data = [],
                      width = 640,
                      height = 400,
                      marginTop = 20,
                      marginRight = 20,
                      marginBottom = 30,
                      marginLeft = 40
                  }: LinePlotProps & { data: number[] }) {
    if (data.length === 0) {
        return <div>No data available</div>;
    }

    const x = d3.scaleLinear([0, data.length - 1], [marginLeft, width - marginRight]);
    const y = d3.scaleLinear(d3.extent(data) as [number, number], [height - marginBottom, marginTop]);
    const line = d3.line<number>((d, i) => x(i), y);

    // Create x-axis
    const xAxis = d3.axisBottom(x).ticks(data.length);

    // Create y-axis
    const yAxis = d3.axisLeft(y);

    return (
        <svg width={width} height={height}>
            <path
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                d={line(data) || undefined}
            />
            <g fill="white" stroke="currentColor" strokeWidth="1.5">
                {data.map((d, i) => (
                    <circle key={i} cx={x(i)} cy={y(d)} r="2.5" />
                ))}
            </g>

            {/* X-axis */}
            <g
                transform={`translate(0,${height - marginBottom})`}
                ref={(node) => node && d3.select(node).call(xAxis)}
            />

            {/* Y-axis */}
            <g
                transform={`translate(${marginLeft},0)`}
                ref={(node) => node && d3.select(node).call(yAxis)}
            />

            {/* X-axis label */}
            <text
                x={width / 2}
                y={height - 5}
                textAnchor="middle"
            >
                Data Points
            </text>

            {/* Y-axis label */}
            <text
                transform={`rotate(-90)`}
                x={-height / 2}
                y={15}
                textAnchor="middle"
            >
                Values
            </text>
        </svg>
    );
}