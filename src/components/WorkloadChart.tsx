'use client';

import { Box, Typography, useTheme } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Assignment } from '@/types/assignment';
import { calculateWorkload } from '@/lib/utils';

interface WorkloadChartProps {
  assignments: Assignment[];
}

export default function WorkloadChart({ assignments }: WorkloadChartProps) {
  const theme = useTheme();
  const data = calculateWorkload(assignments);
  const maxScore = Math.max(...data.map((d) => d.score), 1);

  const getBarColor = (score: number) => {
    if (score === 0) return 'rgba(148, 163, 184, 0.3)';
    const ratio = score / maxScore;
    if (ratio >= 0.75) return theme.palette.error.main;
    if (ratio >= 0.5) return theme.palette.warning.main;
    return theme.palette.primary.main;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            background: 'rgba(17, 24, 39, 0.95)',
            border: '1px solid rgba(148, 163, 184, 0.15)',
            borderRadius: 2,
            p: 1.5,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
            {label}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Workload Score: {payload[0].value}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {payload[0].payload.count} assignment{payload[0].payload.count !== 1 ? 's' : ''}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
        Workload score = low(1) + medium(2) + high(3) per day
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.08)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fill: '#94A3B8', fontSize: 13, fontWeight: 500 }}
            axisLine={{ stroke: 'rgba(148,163,184,0.1)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#94A3B8', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,77,255,0.05)' }} />
          <Bar
            dataKey="score"
            radius={[8, 8, 0, 0]}
            maxBarSize={45}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
}
