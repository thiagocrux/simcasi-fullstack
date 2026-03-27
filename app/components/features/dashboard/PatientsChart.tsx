/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  type LegendProps,
} from 'recharts';

import { findPatients } from '@/app/actions/patient.actions';
import { Patient } from '@/core/domain/entities/patient.entity';
import { logger } from '@/lib/logger.utils';
import { getTimezoneOffset } from '@/lib/shared.utils';
import { CustomSkeleton } from '../../common/CustomSkeleton';
import { Button } from '../../ui/button';

interface TickProps {
  x: number;
  y: number;
  payload: {
    value: string | number;
  };
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  stroke: string;
}

interface TooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string | number;
}

interface LegendPayloadItem {
  value: string;
  color: string;
}

interface LegendPropsExtended extends LegendProps {
  payload?: LegendPayloadItem[];
}

/**
 * Groups patient records by creation date and counts registrations per day.
 *
 * @param patients The list of patients to process.
 * @returns A sorted array of data objects containing date and patient count.
 */
function groupPatientsByDate(patients: Patient[]): Array<{
  name: string;
  pacientes: number;
}> {
  const dateMap = new Map<string, number>();

  patients.forEach((patient) => {
    const date = new Date(patient.createdAt).toISOString().split('T')[0];
    if (!dateMap.has(date)) {
      dateMap.set(date, 0);
    }
    dateMap.set(date, (dateMap.get(date) || 0) + 1);
  });

  return Array.from(dateMap.entries())
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, count]) => ({
      name: date,
      pacientes: count,
    }));
}

/**
 * Renders custom X-axis tick labels formatted as local dates.
 * @param props Tick properties passed by Recharts.
 * @note Uses 'any' cast at call site as Recharts' tick prop has strict internal type requirements.
 */
function CustomXAxisTick(props: TickProps) {
  const { x, y, payload } = props;
  if (!payload) return null;

  let label = String(payload.value);
  label = format(new Date(payload.value as string), 'dd/MM/yyyy');

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor="end"
        fill="#666"
        fontSize={12}
        className="-rotate-35"
      >
        {label}
      </text>
    </g>
  );
}

/**
 * Renders custom Y-axis tick labels for integer values.
 * @param props Tick properties passed by Recharts.
 */
function CustomYAxisTick(props: TickProps) {
  const { x, y, payload } = props;
  if (!payload) return null;

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={-2} y={0} dy={4} textAnchor="middle" fill="#666" fontSize={12}>
        {payload.value}
      </text>
    </g>
  );
}

/**
 * Renders a custom Tooltip with formatted dates and typed values.
 * @param props Tooltip properties passed by Recharts.
 */
function CustomTooltip(props: TooltipProps) {
  const { active, payload, label } = props;

  if (active && payload && payload.length > 0) {
    const formattedDate = format(new Date(String(label)), 'dd/MM/yyyy');

    return (
      <div className="bg-(--color-card) p-2 border border-(--color-border) rounded">
        <p className="m-0 font-semibold text-sm">{formattedDate}</p>
        {payload.map((entry: TooltipPayloadItem, idx: number) => (
          <p
            key={idx}
            style={{ color: entry.stroke, margin: 0 }}
            className="text-sm"
          >
            {entry.name}: <b>{entry.value}</b>
          </p>
        ))}
      </div>
    );
  }
  return null;
}

/**
 * Renders a custom Legend with horizontal item distribution.
 * @param props Legend properties containing the payload of series.
 */
function RenderCustomLegend(props: LegendPropsExtended) {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-4 text-sm">
      {payload?.map((entry: LegendPayloadItem, index: number) => (
        <li key={index} className="flex items-center gap-1">
          <span
            className="inline-block rounded-sm w-3 h-1"
            style={{
              backgroundColor: entry.color,
            }}
          />
          <span>{entry.value}</span>
        </li>
      ))}
    </ul>
  );
}

const RANGE_OPTIONS = [
  { label: 'Últimos 6 meses', value: 180 },
  { label: 'Últimos 30 dias', value: 30 },
  { label: 'Últimos 7 dias', value: 7 },
];

/**
 * PatientsChart component.
 * Displays a BarChart showing the trend of patient registrations over time.
 */
export function PatientsChart() {
  // Avoid hydration mismatch by only rendering after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const [rangeDays, setRangeDays] = useState(180);

  const dateRange = useMemo(() => {
    const now = new Date();
    const startDate = new Date(now.getTime() - rangeDays * 24 * 60 * 60 * 1000);
    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
      timezoneOffset: getTimezoneOffset(),
    };
  }, [rangeDays]);

  const {
    data: patientsData,
    isPending: isPatientsPending,
    error: patientsError,
  } = useQuery({
    queryKey: ['patients-chart', 'patients', dateRange],
    queryFn: async () => {
      try {
        const response = await findPatients({
          skip: 0,
          take: 100,
          ...dateRange,
        });
        if (response.success) {
          return response.data?.items ?? [];
        }
        logger.error(
          'Failed to fetch patients for dashboard chart',
          response.message
        );
        return [];
      } catch (error) {
        logger.error('Failed to fetch patients for dashboard chart', error);
        return [];
      }
    },
    enabled: mounted,
    placeholderData: keepPreviousData,
  });

  const chartData = useMemo(() => {
    if (!patientsData) {
      return [];
    }

    return groupPatientsByDate(patientsData as Patient[]);
  }, [patientsData]);

  const isLoading = isPatientsPending;
  const hasError = patientsError;

  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return <CustomSkeleton variant="chart" />;
  }

  if (hasError) {
    return (
      <div className="flex flex-col justify-center items-center gap-6 mx-auto sm:p-12 px-6 rounded-md max-w-lg text-center">
        <Image
          src="/icons/something-went-wrong.svg"
          width={150}
          height={150}
          alt=""
        />
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xl">Erro ao carregar dados</p>
          <p className="text-muted-foreground">
            Ocorreu um erro ao buscar os dados do gráfico. Tente novamente mais
            tarde ou entre em contato com o suporte caso o problema persista.
          </p>
        </div>
      </div>
    );
  }

  const rangeButtons = (
    <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
      {RANGE_OPTIONS.map((option) => (
        <Button
          key={option.value}
          variant={option.value === rangeDays ? 'outline' : 'secondary'}
          className="flex-1 min-w-[120px] max-w-xs wrap-break-word whitespace-normal cursor-pointer"
          onClick={() => setRangeDays(option.value)}
          type="button"
        >
          <span className="block w-full text-center wrap-break-word whitespace-normal">
            {option.label}
          </span>
        </Button>
      ))}
    </div>
  );

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center">
        {rangeButtons}
        <div className="flex flex-col justify-center items-center gap-6 mx-auto sm:p-12 px-6 rounded-md max-w-lg text-center">
          <Image
            src="/icons/no-results-found.svg"
            width={150}
            height={150}
            alt=""
          />
          <div className="flex flex-col gap-2">
            <p className="font-bold text-xl">Nenhum dado encontrado</p>
            <p className="text-muted-foreground">
              Não há registros de pacientes para o período selecionado. Tente
              ajustar o intervalo de datas ou cadastre novos pacientes para
              visualizar o gráfico.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
        {RANGE_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={option.value === rangeDays ? 'outline' : 'secondary'}
            className="flex-1 min-w-[120px] max-w-xs wrap-break-word whitespace-normal cursor-pointer"
            onClick={() => setRangeDays(option.value)}
            type="button"
          >
            <span className="block w-full text-center wrap-break-word whitespace-normal">
              {option.label}
            </span>
          </Button>
        ))}
      </div>
      <BarChart
        className="w-full max-w-full"
        style={{
          aspectRatio: 1.618,
        }}
        responsive
        data={chartData}
        margin={{
          top: 0,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <CartesianGrid
          strokeDasharray="2 2"
          stroke="var(--color-border)"
          horizontal={true}
          vertical={true}
        />
        <XAxis dataKey="name" height={60} tick={CustomXAxisTick as any} />
        <YAxis
          width="auto"
          allowDecimals={false}
          domain={[0, 'dataMax + 1']}
          tickFormatter={(value) => (Number.isInteger(value) ? value : '')}
          tick={CustomYAxisTick as any}
        />
        <Tooltip content={CustomTooltip as any} />
        <Legend
          verticalAlign="top"
          align="center"
          content={<RenderCustomLegend />}
        />
        <Bar dataKey="pacientes" fill="var(--color-chart-1)" name="Pacientes" />
      </BarChart>
    </div>
  );
}
