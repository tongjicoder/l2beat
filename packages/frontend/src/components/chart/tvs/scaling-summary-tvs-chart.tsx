'use client'

import { UnixTime } from '@l2beat/shared-pure'
import Link from 'next/link'
import { useMemo } from 'react'
import type { TooltipProps } from 'recharts'
import { AreaChart } from 'recharts'
import type { ChartMeta } from '~/components/core/chart/chart'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
} from '~/components/core/chart/chart'
import { ChartDataIndicator } from '~/components/core/chart/chart-data-indicator'
import {
  CyanFillGradientDef,
  CyanStrokeGradientDef,
} from '~/components/core/chart/defs/cyan-gradient-def'
import {
  PinkFillGradientDef,
  PinkStrokeGradientDef,
} from '~/components/core/chart/defs/pink-gradient-def'
import {
  YellowFillGradientDef,
  YellowStrokeGradientDef,
} from '~/components/core/chart/defs/yellow-gradient-def'
import { getCommonChartComponents } from '~/components/core/chart/utils/get-common-chart-components'
import { getStrokeOverFillAreaComponents } from '~/components/core/chart/utils/get-stroke-over-fill-area-components'
import { HorizontalSeparator } from '~/components/core/horizontal-separator'
import { Skeleton } from '~/components/core/skeleton'
import { tooltipContentVariants } from '~/components/core/tooltip/tooltip'
import { CustomLink } from '~/components/link/custom-link'
import { PercentChange } from '~/components/percent-change'
import { useRecategorisationPreviewContext } from '~/components/recategorisation-preview/recategorisation-preview-provider'
import { ChevronIcon } from '~/icons/chevron'
import type { TvsChartRange } from '~/server/features/scaling/tvs/utils/range'
import { api } from '~/trpc/react'
import { formatTimestamp } from '~/utils/dates'
import { formatCurrency } from '~/utils/number-format/format-currency'
import type { ChartUnit } from '../types'

const chartMeta = {
  rollups: {
    label: 'Rollups',
    color: 'hsl(var(--chart-pink))',
    indicatorType: {
      shape: 'line',
    },
  },
  validiumsAndOptimiums: {
    label: 'Validiums & Optimiums',
    color: 'hsl(var(--chart-cyan))',
    indicatorType: {
      shape: 'line',
    },
  },
  others: {
    label: 'Others',
    color: 'hsl(var(--chart-yellow))',
    indicatorType: {
      shape: 'line',
    },
  },
} satisfies ChartMeta

export function ScalingSummaryTvsChart({
  unit,
  timeRange,
}: { unit: ChartUnit; timeRange: TvsChartRange }) {
  const { checked } = useRecategorisationPreviewContext()
  const { data, isLoading } = api.tvs.recategorisedChart.useQuery({
    range: timeRange,
    filter: { type: 'layer2' },
    previewRecategorisation: checked,
  })

  const chartData = useMemo(() => {
    return data?.map(([timestamp, rollups, validiumsAndOptimiums, others]) => {
      return {
        timestamp,
        rollups,
        validiumsAndOptimiums,
        others,
      }
    })
  }, [data])
  const stats = getStats(chartData)

  return (
    <section className="flex flex-col gap-4">
      <Header
        total={stats?.total}
        change={stats?.change}
        unit={unit}
        timeRange={timeRange}
      />
      <ChartContainer meta={chartMeta} data={chartData} isLoading={isLoading}>
        <AreaChart
          data={chartData}
          margin={{ top: 20, right: 0, left: 0, bottom: 0 }}
        >
          <defs>
            <PinkFillGradientDef id="rollups-fill" />
            <PinkStrokeGradientDef id="rollups-stroke" />
            <CyanFillGradientDef id="validiums-and-optimiums-fill" />
            <CyanStrokeGradientDef id="validiums-and-optimiums-stroke" />
            <YellowFillGradientDef id="others-fill" />
            <YellowStrokeGradientDef id="others-stroke" />
          </defs>
          <ChartLegend content={<ChartLegendContent />} />
          {getStrokeOverFillAreaComponents({
            data: [
              {
                dataKey: 'rollups',
                stroke: 'url(#rollups-stroke)',
                fill: 'url(#rollups-fill)',
              },
              {
                dataKey: 'validiumsAndOptimiums',
                stroke: 'url(#validiums-and-optimiums-stroke)',
                fill: 'url(#validiums-and-optimiums-fill)',
              },
              {
                dataKey: 'others',
                stroke: 'url(#others-stroke)',
                fill: 'url(#others-fill)',
              },
            ],
          })}
          {getCommonChartComponents({
            data: chartData,
            isLoading,
            yAxis: {
              tickFormatter: (value: number) => formatCurrency(value, unit),
            },
          })}
          <ChartTooltip content={<CustomTooltip />} />
        </AreaChart>
      </ChartContainer>
    </section>
  )
}

function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (!active || !payload || typeof label !== 'number') return null
  const validPayload = payload.filter((p) => p.type !== 'none')
  const total = validPayload.reduce((acc, curr) => acc + (curr?.value ?? 0), 0)
  const isFullDay = UnixTime.isFull(UnixTime(label), 'day')
  return (
    <div className={tooltipContentVariants()}>
      <div className="flex !w-[158px] flex-col [@media(min-width:600px)]:!w-60">
        <div className="label-value-14-medium mb-3 text-secondary">
          {isFullDay
            ? formatTimestamp(label, { longMonthName: true })
            : formatTimestamp(label, { longMonthName: true, mode: 'datetime' })}
        </div>
        <div className="heading-16 mb-1.5 flex w-full items-center justify-between gap-2">
          <span className="[@media(min-width:600px)]:hidden">Total</span>
          <span className="hidden [@media(min-width:600px)]:inline">
            Total value secured
          </span>
          <span className="text-primary">{formatCurrency(total, 'usd')}</span>
        </div>
        <HorizontalSeparator />
        <div className="mt-2 flex flex-col gap-2">
          {payload.map((entry) => {
            if (entry.value === undefined || entry.type === 'none') return null
            const config = chartMeta[entry.name as keyof typeof chartMeta]
            return (
              <div
                key={entry.name}
                className="flex items-center justify-between gap-x-1"
              >
                <span className="flex items-center gap-1">
                  <ChartDataIndicator
                    backgroundColor={config.color}
                    type={config.indicatorType}
                  />
                  <span className="label-value-14-medium w-20 sm:w-fit">
                    {config.label}
                  </span>
                </span>
                <span className="label-value-15-medium whitespace-nowrap">
                  {formatCurrency(entry.value, 'usd')}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface Props {
  total: number | undefined
  change: number | undefined
  unit: ChartUnit
  timeRange: TvsChartRange
}

function Header({ total, unit, change, timeRange }: Props) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold">Value Secured</span>
          <Link
            className="flex h-[28px] items-center justify-center gap-1 rounded-md border border-link-stroke px-3 py-2 text-[13px] font-bold leading-none text-link max-md:hidden"
            href="/scaling/tvs"
          >
            View details
            <ChevronIcon className="size-2.5 -rotate-90 fill-current" />
          </Link>
        </div>
        <CustomLink
          href="/scaling/tvs"
          className="flex items-center gap-1 text-xs leading-[1.15] md:hidden"
          underline={false}
        >
          Details
          <ChevronIcon className="size-2 -rotate-90 fill-current" />
        </CustomLink>
      </div>
      <div className="flex flex-col items-end">
        <div className="whitespace-nowrap text-right text-xl font-bold">
          {total === undefined ? (
            <Skeleton className="my-[5px] h-5 w-32" />
          ) : (
            formatCurrency(total, unit)
          )}
        </div>
        {change === undefined ? (
          <Skeleton className="my-0.5 h-4 w-40" />
        ) : (
          <p className="whitespace-nowrap text-right text-xs">
            <PercentChange value={change} />
            <span className="text-secondary"> / {timeRange}</span>
          </p>
        )}
      </div>
    </div>
  )
}

function getStats(
  data:
    | {
        timestamp: number
        rollups: number
        validiumsAndOptimiums: number
        others: number
      }[]
    | undefined,
) {
  if (!data) {
    return undefined
  }
  const oldestDataPoint = data.at(0)
  const newestDataPoint = data.at(-1)
  if (!oldestDataPoint || !newestDataPoint) {
    return undefined
  }

  const oldestTotal =
    oldestDataPoint.rollups +
    oldestDataPoint.validiumsAndOptimiums +
    oldestDataPoint.others
  const newestTotal =
    newestDataPoint.rollups +
    newestDataPoint.validiumsAndOptimiums +
    newestDataPoint.others
  const change = newestTotal / oldestTotal - 1

  return {
    total: newestTotal,
    change,
  }
}
