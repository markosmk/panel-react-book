export type IconSVG = (props: IconProps) => JSX.Element;

type IconProps = React.HTMLAttributes<SVGElement>;

// all icons from https://tabler.io/icons -> Filled version
export const Icons = {
  whatsapp: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18.497 4.409a10 10 0 0 1 -10.36 16.828l-.223 -.098l-4.759 .849l-.11 .011a1 1 0 0 1 -.11 0l-.102 -.013l-.108 -.024l-.105 -.037l-.099 -.047l-.093 -.058l-.014 -.011l-.012 -.007l-.086 -.073l-.077 -.08l-.067 -.088l-.056 -.094l-.034 -.07l-.04 -.108l-.028 -.128l-.012 -.102a1 1 0 0 1 0 -.125l.012 -.1l.024 -.11l.045 -.122l1.433 -3.304l-.009 -.014a10 10 0 0 1 1.549 -12.454l.215 -.203a10 10 0 0 1 13.226 -.217m-8.997 3.09a1.5 1.5 0 0 0 -1.5 1.5v1a6 6 0 0 0 6 6h1a1.5 1.5 0 0 0 0 -3h-1l-.144 .007a1.5 1.5 0 0 0 -1.128 .697l-.042 .074l-.022 -.007a4.01 4.01 0 0 1 -2.435 -2.435l-.008 -.023l.075 -.041a1.5 1.5 0 0 0 .704 -1.272v-1a1.5 1.5 0 0 0 -1.5 -1.5" />
    </svg>
  ),
  transform: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 6a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
      <path d="M21 11v-3a2 2 0 0 0 -2 -2h-6l3 3m0 -6l-3 3" />
      <path d="M3 13v3a2 2 0 0 0 2 2h6l-3 -3m0 6l3 -3" />
      <path d="M15 18a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
    </svg>
  ),
  look: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
      <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
    </svg>
  ),
  edit: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
      <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
      <path d="M16 5l3 3" />
    </svg>
  ),
  pending: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="Subtract"
        fill="currentColor"
        fillRule="evenodd"
        d="M0 2.5A2.5 2.5 0 0 1 2.5 0h9A2.5 2.5 0 0 1 14 2.5v9a2.5 2.5 0 0 1 -2.5 2.5h-9A2.5 2.5 0 0 1 0 11.5v-9Zm7 5.7a1.2 1.2 0 1 0 0 -2.4 1.2 1.2 0 0 0 0 2.4Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
    </svg>
  ),
  success: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="Subtract"
        fill="currentColor"
        fillRule="evenodd"
        d="M3.5 0C1.567 0 0 1.567 0 3.5v7C0 12.433 1.567 14 3.5 14h7c1.933 0 3.5 -1.567 3.5 -3.5v-7C14 1.567 12.433 0 10.5 0h-7Zm7.0028 5.21852c0.2587 -0.32345 0.2063 -0.79541 -0.1172 -1.05417 -0.3234 -0.25876 -0.79538 -0.20632 -1.05414 0.11713L5.78557 8.71384 4.36711 7.65c-0.33137 -0.24853 -0.80147 -0.18137 -1.05 0.15 -0.24852 0.33137 -0.18137 0.80147 0.15 1.05l2 1.5c0.32408 0.2431 0.7826 0.1848 1.03566 -0.1315l4.00003 -4.99998Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
    </svg>
  ),
  canceled: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="Subtract"
        fill="currentColor"
        fillRule="evenodd"
        d="M3.5 0C1.567 0 0 1.567 0 3.5v7C0 12.433 1.567 14 3.5 14h7c1.933 0 3.5 -1.567 3.5 -3.5v-7C14 1.567 12.433 0 10.5 0h-7ZM4 6.25c-0.41421 0 -0.75 0.33579 -0.75 0.75s0.33579 0.75 0.75 0.75h6c0.4142 0 0.75 -0.33579 0.75 -0.75s-0.3358 -0.75 -0.75 -0.75H4Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
    </svg>
  ),
  circle: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="Vector"
        fill="currentColor"
        d="M7 14c3.866 0 7 -3.134 7 -7 0 -3.86599 -3.134 -7 -7 -7 -3.86599 0 -7 3.13401 -7 7 0 3.866 3.13401 7 7 7Z"
        strokeWidth={1}
      />
    </svg>
  ),
  dashboard: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="rectangle 629"
        fill="currentColor"
        d="M12.5 9.5c0.5523 0 1 0.44772 1 1l0 2c0 0.5523 -0.4477 1 -1 1l-11 0c-0.552285 0 -1 -0.4477 -1 -1l0 -2c0 -0.55229 0.447715 -1 1 -1l11 0Z"
        strokeWidth={1}
      />
      <path
        id="rectangle 634"
        fill="currentColor"
        d="M7 0.5c0.55228 0 1 0.447715 1 1L8 7c0 0.55228 -0.44772 1 -1 1L1.43161 8C0.879326 8 0.431611 7.55228 0.431611 7l0 -5.5c0 -0.552285 0.447715 -1 0.999999 -1L7 0.5Z"
        strokeWidth={1}
      />
      <path
        id="rectangle 636"
        fill="currentColor"
        d="M13 4.75c0.2761 0 0.5 0.22386 0.5 0.5l0 2.25c0 0.27614 -0.2239 0.5 -0.5 0.5l-3 0c-0.27614 0 -0.5 -0.22386 -0.5 -0.5l0 -2.25c0 -0.27614 0.22386 -0.5 0.5 -0.5l3 0Z"
        strokeWidth={1}
      />
      <path
        id="rectangle 637"
        fill="currentColor"
        d="M13 0.5c0.2761 0 0.5 0.223858 0.5 0.5l0 2.25c0 0.27614 -0.2239 0.5 -0.5 0.5l-3 0c-0.27614 0 -0.5 -0.22386 -0.5 -0.5L9.5 1c0 -0.276142 0.22386 -0.5 0.5 -0.5l3 0Z"
        strokeWidth={1}
      />
    </svg>
  ),
  calendar: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M16 2a1 1 0 0 1 .993 .883l.007 .117v1h1a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h1v-1a1 1 0 0 1 1.993 -.117l.007 .117v1h6v-1a1 1 0 0 1 1 -1zm3 7h-14v9.625c0 .705 .386 1.286 .883 1.366l.117 .009h12c.513 0 .936 -.53 .993 -1.215l.007 -.16v-9.625z" />
      <path d="M12 12a1 1 0 0 1 .993 .883l.007 .117v3a1 1 0 0 1 -1.993 .117l-.007 -.117v-2a1 1 0 0 1 -.117 -1.993l.117 -.007h1z" />
    </svg>
  ),
  tours: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="Union"
        fill="currentColor"
        fillRule="evenodd"
        d="M7.56075 0.329923c-0.25584 -0.068516 -0.51879 0.083297 -0.58737 0.339116L4.63904 9.37652c-0.06861 0.25591 0.08327 0.51897 0.3392 0.58751l6.08346 1.62927c0.2559 0.0685 0.5188 -0.0833 0.5874 -0.3391l2.3344 -8.70752c0.0686 -0.25591 -0.0833 -0.51897 -0.3392 -0.58751L7.56075 0.329923ZM3.43167 9.05281l1.59639 -5.95479L0.355742 4.34933c-0.2559281 0.06854 -0.4078085 0.33161 -0.3392026 0.58752L2.35089 13.6443c0.06858 0.2558 0.33153 0.4077 0.58736 0.3391l6.0835 -1.6292c0.00794 -0.0021 0.01579 -0.0044 0.02352 -0.0069l-4.3904 -1.1758c-0.9229 -0.2472 -1.4706 -1.19585 -1.2232 -2.11869Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
    </svg>
  ),
  bookings: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="Subtract"
        fill="currentColor"
        fillRule="evenodd"
        d="M1.43934 0.43934C1.72064 0.158035 2.10218 0 2.5 0h6c0.13261 0 0.25979 0.0526784 0.35355 0.146447L12.8536 4.14645c0.0937 0.09376 0.1464 0.22094 0.1464 0.35355v8c0 0.3978 -0.158 0.7794 -0.4393 1.0607S11.8978 14 11.5 14h-9c-0.39783 0 -0.77936 -0.158 -1.06066 -0.4393C1.15804 13.2794 1 12.8978 1 12.5v-11c0 -0.39782 0.15804 -0.779356 0.43934 -1.06066ZM4.9558 3.95126c0.56573 0 1.02434 -0.45861 1.02434 -1.02434 0 -0.56572 -0.45861 -1.02433 -1.02434 -1.02433 -0.56572 0 -1.02433 0.45861 -1.02433 1.02433 0 0.56573 0.45861 1.02434 1.02433 1.02434Zm-2.08001 4.5487c-0.00051 -0.34518 0.27889 -0.625 0.62407 -0.625h7.00004c0.3451 0 0.6254 0.27982 0.6259 0.625 0.0005 0.34517 -0.2789 0.625 -0.6241 0.62499H3.50173c-0.34517 0 -0.62542 -0.27982 -0.62594 -0.62499Zm0 3.00004c-0.00051 -0.3452 0.27889 -0.625 0.62407 -0.625h4c0.34518 0 0.62542 0.2798 0.62594 0.625 0.00052 0.3451 -0.27888 0.625 -0.62406 0.625H3.50173c-0.34517 0 -0.62542 -0.2799 -0.62594 -0.625Zm2.0794 -6.86597c-0.69983 0 -1.33818 0.26318 -1.8215 0.69596 -0.28689 0.25688 -0.06285 0.66982 0.32224 0.66982h2.99852c0.38509 0 0.60912 -0.41294 0.32224 -0.66982 -0.48332 -0.43278 -1.12168 -0.69596 -1.8215 -0.69596Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
    </svg>
  ),
  customers: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="Union"
        fill="currentColor"
        fillRule="evenodd"
        d="M8 4.50003c0 1.65685 -1.34315 3 -3 3s-3 -1.34315 -3 -3 1.34315 -3 3 -3 3 1.34315 3 3ZM5 8.5c-2.76142 0 -5 2.2386 -5 5 0 0.2761 0.223858 0.5 0.5 0.5h9c0.27614 0 0.5 -0.2239 0.5 -0.5 0 -2.7614 -2.23858 -5 -5 -5Zm8.5001 5.5h-2.3225c0.0472 -0.1584 0.0725 -0.3263 0.0725 -0.5 0 -2.0411 -0.9784 -3.85363 -2.49178 -4.99426 0.08011 -0.00381 0.16071 -0.00574 0.24176 -0.00574 2.76142 0 5.00002 2.2386 5.00002 5 0 0.2761 -0.2239 0.5 -0.5 0.5ZM9.00008 7.50003c-0.30173 0 -0.59305 -0.04455 -0.86775 -0.12742 0.69409 -0.75643 1.11775 -1.76503 1.11775 -2.87258s-0.42366 -2.11615 -1.11776 -2.87259c0.27471 -0.08287 0.56603 -0.12741 0.86776 -0.12741 1.65682 0 3.00002 1.34315 3.00002 3s-1.3432 3 -3.00002 3Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
    </svg>
  ),
  settings: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 14 14"
      height={14}
      width={14}
      {...props}
    >
      <path
        id="Subtract"
        fill="currentColor"
        fillRule="evenodd"
        d="m5.557 0.69 -0.463 1.195 -1.594 0.904 -1.27 -0.194a1.077 1.077 0 0 0 -1.078 0.528l-0.43 0.754a1.077 1.077 0 0 0 0.086 1.217l0.807 1.001v1.81L0.83 8.906a1.077 1.077 0 0 0 -0.086 1.217l0.43 0.754a1.077 1.077 0 0 0 1.078 0.528l1.27 -0.194 1.573 0.904 0.463 1.196a1.076 1.076 0 0 0 1 0.689h0.905a1.076 1.076 0 0 0 1.002 -0.69l0.463 -1.195 1.572 -0.904 1.27 0.194a1.077 1.077 0 0 0 1.078 -0.528l0.43 -0.754a1.077 1.077 0 0 0 -0.086 -1.217l-0.807 -1.001v-1.81l0.786 -1.001a1.077 1.077 0 0 0 0.086 -1.217l-0.43 -0.754a1.076 1.076 0 0 0 -1.078 -0.528l-1.27 0.194 -1.573 -0.904L8.443 0.689A1.077 1.077 0 0 0 7.442 0h-0.884a1.077 1.077 0 0 0 -1.001 0.69ZM7 9.25a2.25 2.25 0 1 0 0 -4.5 2.25 2.25 0 0 0 0 4.5Z"
        clipRule="evenodd"
        strokeWidth={1}
      />
    </svg>
  ),
  archive: (props: IconProps) => (
    // outline
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
      <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
      <path d="M10 12l4 0" />
    </svg>
  ),
  remove: (props: IconProps) => (
    // in outline
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M4 7l16 0" />
      <path d="M10 11l0 6" />
      <path d="M14 11l0 6" />
      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    </svg>
  ),
  copy: (props: IconProps) => (
    // outline
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
      <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
    </svg>
  ),
  dotCircle: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M8 12l0 .01" />
      <path d="M12 12l0 .01" />
      <path d="M16 12l0 .01" />
    </svg>
  ),
  logout: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
      <path d="M9 12h12l-3 -3" />
      <path d="M18 15l3 -3" />
    </svg>
  ),
  error: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 1.999l.041 .002l.208 .003a8 8 0 0 1 7.747 7.747l.003 .248l.177 .006a3 3 0 0 1 2.819 2.819l.005 .176a3 3 0 0 1 -3 3l-.001 1.696l1.833 2.75a1 1 0 0 1 -.72 1.548l-.112 .006h-10c-3.445 .002 -6.327 -2.49 -6.901 -5.824l-.028 -.178l-.071 .001a3 3 0 0 1 -2.995 -2.824l-.005 -.175a3 3 0 0 1 3 -3l.004 -.25a8 8 0 0 1 7.996 -7.75zm0 10.001a2 2 0 0 0 -2 2a1 1 0 0 0 1 1h2a1 1 0 0 0 1 -1a2 2 0 0 0 -2 -2zm-1.99 -4l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993zm4 0l-.127 .007a1 1 0 0 0 .117 1.993l.127 -.007a1 1 0 0 0 -.117 -1.993z" />
    </svg>
  ),
  spinner: (props: IconProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path
        d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
        opacity=".25"
      />
      <path
        d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z"
        className="animate-spin duration-700"
        style={{ transformOrigin: 'center' }}
      />
    </svg>
  ),
  mail: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M22 7.535v9.465a3 3 0 0 1 -2.824 2.995l-.176 .005h-14a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-9.465l9.445 6.297l.116 .066a1 1 0 0 0 .878 0l.116 -.066l9.445 -6.297z" />
      <path d="M19 4c1.08 0 2.027 .57 2.555 1.427l-9.555 6.37l-9.555 -6.37a2.999 2.999 0 0 1 2.354 -1.42l.201 -.007h14z" />
    </svg>
  ),
  info: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 9h-1l-.117 .007a1 1 0 0 0 0 1.986l.117 .007v3l.007 .117a1 1 0 0 0 .876 .876l.117 .007h1l.117 -.007a1 1 0 0 0 .876 -.876l.007 -.117l-.007 -.117a1 1 0 0 0 -.764 -.857l-.112 -.02l-.117 -.006v-3l-.007 -.117a1 1 0 0 0 -.876 -.876l-.117 -.007zm.01 -3l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007z" />
    </svg>
  ),
  help: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 2c5.523 0 10 4.477 10 10a10 10 0 0 1 -19.995 .324l-.005 -.324l.004 -.28c.148 -5.393 4.566 -9.72 9.996 -9.72zm0 13a1 1 0 0 0 -.993 .883l-.007 .117l.007 .127a1 1 0 0 0 1.986 0l.007 -.117l-.007 -.127a1 1 0 0 0 -.993 -.883zm1.368 -6.673a2.98 2.98 0 0 0 -3.631 .728a1 1 0 0 0 1.44 1.383l.171 -.18a.98 .98 0 0 1 1.11 -.15a1 1 0 0 1 -.34 1.886l-.232 .012a1 1 0 0 0 .111 1.994a3 3 0 0 0 1.371 -5.673z" />
    </svg>
  ),
  warning: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 1.67c.955 0 1.845 .467 2.39 1.247l.105 .16l8.114 13.548a2.914 2.914 0 0 1 -2.307 4.363l-.195 .008h-16.225a2.914 2.914 0 0 1 -2.582 -4.2l.099 -.185l8.11 -13.538a2.914 2.914 0 0 1 2.491 -1.403zm.01 13.33l-.127 .007a1 1 0 0 0 0 1.986l.117 .007l.127 -.007a1 1 0 0 0 0 -1.986l-.117 -.007zm-.01 -7a1 1 0 0 0 -.993 .883l-.007 .117v4l.007 .117a1 1 0 0 0 1.986 0l.007 -.117v-4l-.007 -.117a1 1 0 0 0 -.993 -.883z" />
    </svg>
  ),
  book: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12.088 4.82a10 10 0 0 1 9.412 .314a1 1 0 0 1 .493 .748l.007 .118v13a1 1 0 0 1 -1.5 .866a8 8 0 0 0 -8 0a1 1 0 0 1 -1 0a8 8 0 0 0 -7.733 -.148l-.327 .18l-.103 .044l-.049 .016l-.11 .026l-.061 .01l-.117 .006h-.042l-.11 -.012l-.077 -.014l-.108 -.032l-.126 -.056l-.095 -.056l-.089 -.067l-.06 -.056l-.073 -.082l-.064 -.089l-.022 -.036l-.032 -.06l-.044 -.103l-.016 -.049l-.026 -.11l-.01 -.061l-.004 -.049l-.002 -.068v-13a1 1 0 0 1 .5 -.866a10 10 0 0 1 9.412 -.314l.088 .044l.088 -.044z" />
    </svg>
  ),
  check: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
    </svg>
  )
};
