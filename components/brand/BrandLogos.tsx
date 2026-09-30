import React from 'react';

export interface BrandLogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

export function LogoBosch({ className = 'w-auto h-7', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 180 40"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="28" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="4.5" />
      <path d="M19 14h18v12H19z" fill="none" stroke="currentColor" strokeWidth="3" />
      <text
        x="110"
        y="29"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="28"
        letterSpacing="1.5"
        textAnchor="middle"
        fill="currentColor"
      >
        BOSCH
      </text>
    </svg>
  );
}

export function LogoAsko({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="28"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="34"
        letterSpacing="4"
        textAnchor="middle"
        fill="currentColor"
      >
        ASKO
      </text>
    </svg>
  );
}

export function LogoLiebherr({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 200 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="28"
        letterSpacing="2"
        textAnchor="middle"
        fill="currentColor"
      >
        LIEBHERR
      </text>
    </svg>
  );
}

export function LogoSmeg({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="30"
        letterSpacing="6"
        textAnchor="middle"
        fill="currentColor"
      >
        SMEG
      </text>
    </svg>
  );
}

export function LogoMiele({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="30"
        letterSpacing="2"
        textAnchor="middle"
        fill="currentColor"
      >
        Miele
      </text>
      <polygon points="69,8 75,5 73,11 67,14" fill="currentColor" />
    </svg>
  );
}

export function LogoOmoikiri({ className = 'w-auto h-5', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 180 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="26"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="24"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        OMOIKIRI
      </text>
    </svg>
  );
}

export function LogoElica({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="700"
        fontSize="30"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        elica
      </text>
    </svg>
  );
}

export function LogoMidea({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="28"
        letterSpacing="1"
        textAnchor="middle"
        fill="currentColor"
      >
        Midea
      </text>
    </svg>
  );
}

export function LogoKorting({ className = 'w-auto h-5', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 180 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="26"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="2"
        textAnchor="middle"
        fill="currentColor"
      >
        KÖRTING
      </text>
    </svg>
  );
}

export function LogoFalmec({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="28"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        falmec
      </text>
    </svg>
  );
}

export function LogoBertazzoni({ className = 'w-auto h-5', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 200 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="26"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="22"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        BERTAZZONI
      </text>
    </svg>
  );
}

export function LogoEvelux({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        EVELUX
      </text>
    </svg>
  );
}

export function LogoGraude({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="25"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        GRAUDE
      </text>
    </svg>
  );
}

export function LogoMeyvel({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        MEYVEL
      </text>
    </svg>
  );
}

export function LogoDunavox({ className = 'w-auto h-5', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 180 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="26"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="25"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        DUNAVOX
      </text>
    </svg>
  );
}

export function LogoFranke({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        FRANKE
      </text>
    </svg>
  );
}

export function LogoVard({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="30"
        letterSpacing="4"
        textAnchor="middle"
        fill="currentColor"
      >
        VARD
      </text>
    </svg>
  );
}

export function LogoHiberg({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        HIBERG
      </text>
    </svg>
  );
}

export function LogoSchulthess({ className = 'w-auto h-5', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 200 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="26"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="22"
        letterSpacing="2"
        textAnchor="middle"
        fill="currentColor"
      >
        SCHULTHESS
      </text>
    </svg>
  );
}

export function LogoCaso({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="900"
        fontSize="28"
        letterSpacing="4"
        textAnchor="middle"
        fill="currentColor"
      >
        CASO
      </text>
    </svg>
  );
}

export function LogoKuppersberg({ className = 'w-auto h-5', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 200 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="26"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="20"
        letterSpacing="2"
        textAnchor="middle"
        fill="currentColor"
      >
        KUPPERSBERG
      </text>
    </svg>
  );
}

export function LogoGorenje({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="700"
        fontSize="26"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        gorenje
      </text>
    </svg>
  );
}

export function LogoNivona({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        NIVONA
      </text>
    </svg>
  );
}

export function LogoSteba({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        STEBA
      </text>
    </svg>
  );
}

export function LogoRommelsbacher({ className = 'w-auto h-5', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 200 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="26"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="19"
        letterSpacing="2"
        textAnchor="middle"
        fill="currentColor"
      >
        ROMMELSBACHER
      </text>
    </svg>
  );
}

export function LogoAlveus({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        ALVEUS
      </text>
    </svg>
  );
}

export function LogoBugatti({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="26"
        letterSpacing="3"
        textAnchor="middle"
        fill="currentColor"
      >
        BUGATTI
      </text>
    </svg>
  );
}

export function LogoEko({ className = 'w-auto h-6', ...props }: BrandLogoProps) {
  return (
    <svg
      viewBox="0 0 160 36"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <text
        x="50%"
        y="27"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="28"
        letterSpacing="4"
        textAnchor="middle"
        fill="currentColor"
      >
        EKO
      </text>
    </svg>
  );
}

export function BrandLogo({ name, className }: { name: string; className?: string }) {
  const normalized = name.trim().toUpperCase();

  switch (normalized) {
    case 'BOSCH':
      return <LogoBosch className={className} />;
    case 'ASKO':
      return <LogoAsko className={className} />;
    case 'LIEBHERR':
      return <LogoLiebherr className={className} />;
    case 'SMEG':
      return <LogoSmeg className={className} />;
    case 'MIELE':
      return <LogoMiele className={className} />;
    case 'OMOIKIRI':
      return <LogoOmoikiri className={className} />;
    case 'ELICA':
      return <LogoElica className={className} />;
    case 'MIDEA':
      return <LogoMidea className={className} />;
    case 'KORTING':
    case 'KÖRTING':
      return <LogoKorting className={className} />;
    case 'FALMEC':
      return <LogoFalmec className={className} />;
    case 'BERTAZZONI':
      return <LogoBertazzoni className={className} />;
    case 'EVELUX':
      return <LogoEvelux className={className} />;
    case 'GRAUDE':
      return <LogoGraude className={className} />;
    case 'MEYVEL':
      return <LogoMeyvel className={className} />;
    case 'DUNAVOX':
      return <LogoDunavox className={className} />;
    case 'FRANKE':
      return <LogoFranke className={className} />;
    case 'VARD':
      return <LogoVard className={className} />;
    case 'HIBERG':
      return <LogoHiberg className={className} />;
    case 'SCHULTHESS':
      return <LogoSchulthess className={className} />;
    case 'CASO':
      return <LogoCaso className={className} />;
    case 'KUPPERSBERG':
      return <LogoKuppersberg className={className} />;
    case 'GORENJE':
      return <LogoGorenje className={className} />;
    case 'NIVONA':
      return <LogoNivona className={className} />;
    case 'STEBA':
      return <LogoSteba className={className} />;
    case 'ROMMELSBACHER':
      return <LogoRommelsbacher className={className} />;
    case 'ALVEUS':
      return <LogoAlveus className={className} />;
    case 'BUGATTI':
      return <LogoBugatti className={className} />;
    case 'EKO':
      return <LogoEko className={className} />;
    default:
      return (
        <span className="font-montserrat text-lg font-extrabold tracking-wider text-white">
          {name}
        </span>
      );
  }
}
