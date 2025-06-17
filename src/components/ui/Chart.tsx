import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { twMerge } from 'tailwind-merge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ChartProps {
  type: 'line' | 'bar' | 'pie' | 'doughnut';
  data: {
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string | string[];
      borderWidth?: number;
    }[];
  };
  options?: any;
  className?: string;
  height?: number;
}

const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
  },
};

export function Chart({
  type,
  data,
  options = {},
  className,
  height = 300,
}: ChartProps) {
  const chartOptions = {
    ...defaultOptions,
    ...options,
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={chartOptions} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={twMerge('w-full', className)}
      style={{ height: `${height}px` }}
    >
      {renderChart()}
    </div>
  );
}

// Predefined color schemes
export const chartColors = {
  primary: [
    'rgba(67, 97, 238, 0.8)',
    'rgba(63, 55, 201, 0.8)',
    'rgba(76, 201, 240, 0.8)',
    'rgba(247, 37, 133, 0.8)',
  ],
  success: [
    'rgba(76, 201, 240, 0.8)',
    'rgba(0, 168, 84, 0.8)',
    'rgba(82, 196, 26, 0.8)',
    'rgba(24, 144, 255, 0.8)',
  ],
  warning: [
    'rgba(247, 37, 133, 0.8)',
    'rgba(250, 140, 22, 0.8)',
    'rgba(245, 34, 45, 0.8)',
    'rgba(250, 173, 20, 0.8)',
  ],
};

// Helper function to generate gradient background
export function createGradient(
  ctx: CanvasRenderingContext2D,
  startColor: string,
  endColor: string
) {
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
}

// Helper function to format chart data
export function formatChartData(
  labels: string[],
  datasets: { label: string; data: number[] }[],
  colorScheme: string[] = chartColors.primary
) {
  return {
    labels,
    datasets: datasets.map((dataset, index) => ({
      ...dataset,
      backgroundColor: colorScheme[index % colorScheme.length],
      borderColor: colorScheme[index % colorScheme.length],
      borderWidth: 1,
    })),
  };
} 