'use client';

import { ApexOptions } from 'apexcharts';
import { renderToString } from 'react-dom/server';

import ChartLegend from '../_components/_utils/ChartLegend';
import ChartTooltip from '../_components/_utils/ChartTooltip';

export const barChartOptions: ApexOptions = {
  chart: {
    type: 'bar',
    fontFamily: 'var(--primary-font)',
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  tooltip: {
    custom(options: any) {
      return renderToString(<ChartTooltip options={options} />);
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    formatter(__: any, opts: any) {
      return renderToString(<ChartLegend options={opts} />);
    },
  },
  fill: {
    type: 'gradient',
    colors: ['#B6932B'],
    gradient: {
      shade: 'dark',
      type: 'vertical',
      gradientToColors: ['#D4AF37'],
      stops: [0, 100],
    },
  },
  plotOptions: {
    bar: {
      columnWidth: '80%',
      borderRadius: 6,
    },
  },
};

export const lineChartOptions: ApexOptions = {
  chart: {
    fontFamily: 'var(--primary-font)',
    toolbar: { show: false },
  },
  dataLabels: { enabled: false },
  tooltip: {
    custom(options: any) {
      return renderToString(<ChartTooltip options={options} />);
    },
  },
  legend: {
    position: 'top',
    horizontalAlign: 'left',
    formatter(__: any, opts: any) {
      return renderToString(<ChartLegend options={opts} />);
    },
  },
  stroke: {
    curve: 'smooth',
  },
};
