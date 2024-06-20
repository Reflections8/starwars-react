import { IconProps } from ".";

export function FooterAmmoBgIcon({ className }: Partial<IconProps>) {
  return (
    <svg
      width="158"
      height="55"
      viewBox="0 0 158 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
		className={className}
    >
      <g filter="url(#filter0_bd_77_3049)">
        <path
          d="M148 2C148 0.89543 147.105 0 146 0H38.0437C37.4494 0 36.8859 0.264283 36.5059 0.721213L10.7266 31.7212C9.64302 33.0242 10.5697 35 12.2644 35H146C147.105 35 148 34.1046 148 33V2Z"
          fill="url(#paint0_linear_77_3049)"
          shape-rendering="crispEdges"
        />
        <path
          d="M146 0.5H38.0437C37.598 0.5 37.1754 0.698213 36.8904 1.04091L11.1111 32.0409C10.2984 33.0182 10.9933 34.5 12.2644 34.5H146C146.828 34.5 147.5 33.8284 147.5 33V2C147.5 1.17157 146.828 0.5 146 0.5Z"
          stroke="url(#paint1_linear_77_3049)"
          stroke-opacity="0.9"
          shape-rendering="crispEdges"
        />
      </g>
      <defs>
        <filter
          id="filter0_bd_77_3049"
          x="0.260498"
          y="-5"
          width="157.74"
          height="60"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <feFlood flood-opacity="0" result="BackgroundImageFix" />
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="2.5" />
          <feComposite
            in2="SourceAlpha"
            operator="in"
            result="effect1_backgroundBlur_77_3049"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="10" />
          <feGaussianBlur stdDeviation="5" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_backgroundBlur_77_3049"
            result="effect2_dropShadow_77_3049"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_77_3049"
            result="shape"
          />
        </filter>
        <linearGradient
          id="paint0_linear_77_3049"
          x1="173.338"
          y1="17.5"
          x2="-38.5306"
          y2="17.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#076CE9" stop-opacity="0.6" />
          <stop offset="1" stop-color="#0E0B26" stop-opacity="0.51" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_77_3049"
          x1="-2"
          y1="17.5"
          x2="148"
          y2="17.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-opacity="0" />
          <stop offset="1" stop-color="#19C2EF" stop-opacity="0.33" />
        </linearGradient>
      </defs>
    </svg>
  );
}
