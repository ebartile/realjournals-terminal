import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

const MailVerified = ({ ...other }) => {
  const theme = useTheme();
  const PRIMARY_LIGHT = theme.palette.primary.light;
  const PRIMARY_MAIN = theme.palette.primary.main;

  return (
    <Box {...other}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 327 240" width="100%" height="100%">
        <linearGradient
          id="prefix__a"
          gradientUnits="userSpaceOnUse"
          x1={-141.324}
          y1={515.094}
          x2={-140.744}
          y2={515.622}
          gradientTransform="matrix(327 0 0 -240.0001 46292 123805.055)"
        >
          <stop offset={0} stopColor="#919eab" />
          <stop offset={1} stopColor="#919eab" stopOpacity={0} />
        </linearGradient>
        <path fill="#7A8E9B" d="M163.4 41.1l-78 66.6 78 66.5 77.8-66.5z" />
        <path fill="#E2E2E2" d="M112.2 65h102.2v102.2H112.2z" />
        <path fill={PRIMARY_MAIN} d="M163.4 174.2l-78-66.5v89.2h155.8v-89.2z" />
        <path fill={PRIMARY_LIGHT} d="M85.4 196.9h155.8l-77.8-66.6z" />
        <path fill="#525C6B" d="M129.3 98.6h53.6v5.3h-53.6zM129.3 82.8h41.4v5.3h-41.4zM129.3 114.5h68.2v5.3h-68.2z" />
        <g>
          <path
            fill="#79CCB8"
            d="M241.2 70c0 16-12.9 28.9-28.9 28.9-16 0-28.9-13-28.9-28.9 0-16 12.9-28.9 28.9-28.9 16 0 28.9 12.9 28.9 28.9z"
          />
          <path
            fill="#525C6B"
            d="M211.2 87.6c-.8 0-1.5-.4-2.1-1l-11.8-14.4c-.9-1.1-.8-2.8.4-3.8 1.2-.9 2.8-.8 3.8.4l9.2 11.3L223 56.3c.7-1.3 2.3-1.8 3.6-1.1 1.3.7 1.9 2.3 1.2 3.6l-14.2 27.4c-.4.8-1.2 1.4-2.1 1.5-.1-.1-.2-.1-.3-.1z"
          />
        </g>
        <path
          opacity={0.2}
          fillRule="evenodd"
          clipRule="evenodd"
          fill="url(#prefix__a)"
          d="M0 132.5c0 27.6 10.2 52.8 26.9 71.9C46.2 226.2 74 240 105.1 240c13.6 0 26.6-2.6 38.5-7.4 6.2-2.5 13.1-2.2 19 .7 7 3.4 14.8 5.3 23.1 5.3 3.4 0 6.8-.3 10-1 9.3-1.8 17.7-6 24.6-12 4.3-3.8 9.9-5.6 15.6-5.6h.1c18.8 0 36.3-5.8 50.7-15.8 13-8.9 23.5-21.1 30.6-35.5 6.1-12.5 9.6-26.6 9.6-41.6 0-51.3-40.7-92.9-90.9-92.9-5.1 0-10.1.4-15 1.3C208.1 14.3 184.9 0 158.4 0c-11.2 0-21.8 2.5-31.3 7.1-9 4.3-17 10.5-23.6 18-22.3.4-42.9 7.8-59.7 20.2C17.3 64.8 0 96.6 0 132.5z"
        />
        <g>
          <path
            opacity={0.545}
            fill="#C4CDD5"
            d="M190.6 29.1c-2.2 0-4.4-.8-6-2.5-3.3-3.3-3.3-8.7 0-12.1 3.3-3.3 8.7-3.3 12.1 0 3.3 3.3 3.3 8.7 0 12.1-1.7 1.6-3.9 2.5-6.1 2.5zm0-11.2c-.7 0-1.4.3-1.9.8-1 1-1 2.7 0 3.7s2.7 1 3.7 0 1-2.7 0-3.7c-.4-.6-1.1-.8-1.8-.8zM123.6 228.2c-2.2 0-4.4-.8-6-2.5-3.3-3.3-3.3-8.7 0-12.1 3.3-3.3 8.7-3.3 12.1 0 3.3 3.3 3.3 8.7 0 12.1-1.8 1.7-4 2.5-6.1 2.5zm0-11.2c-.7 0-1.4.3-1.9.8-1 1-1 2.7 0 3.7s2.7 1 3.7 0 1-2.7 0-3.7c-.5-.5-1.2-.8-1.8-.8z"
          />
          <path
            fill="#DFE3E8"
            d="M272.7 188c-.8 0-1.5-.3-2.1-.9l-3.5-3.5-3.5 3.5c-1.1 1.1-3 1.1-4.2 0-1.1-1.1-1.1-3 0-4.2l5.6-5.6c1.1-1.1 3-1.1 4.2 0l5.6 5.6c1.1 1.1 1.1 3 0 4.2-.6.6-1.4.9-2.1.9z"
          />
          <path
            fill="#D5DBE0"
            d="M65.2 176.8c-.8 0-1.5-.3-2.1-.9l-3.5-3.5-3.5 3.6c-1.1 1.1-3 1.1-4.2 0-1.1-1.1-1.1-3 0-4.2l5.6-5.6c1.1-1.1 3-1.1 4.2 0l5.6 5.6c1.1 1.1 1.1 3 0 4.2-.6.5-1.3.8-2.1.8z"
          />
        </g>
      </svg>
    </Box>
  );
};

export default MailVerified;
