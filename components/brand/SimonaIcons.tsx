import React from 'react';

export interface SimonaIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
  color?: string;
}

/** Бирка / Сертификат (Figma Node 1236:59636) */
export function SimonaIconTag({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 91 91"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M85.3015 -0.00293782L64.4137 20.8908L70.1126 26.5881L91.0004 5.69438L85.3015 -0.00293782Z" fill="currentColor"/>
<path d="M75.4371 29.9272V40.504L33.2814 82.6698L8.34049 57.7188L50.4962 15.5631H78.4087L79.4664 14.5054V7.50462H50.3854C48.3003 7.50462 46.3461 8.31047 44.8755 9.79121L2.16571 52.501C0.765552 53.8911 0 55.7445 0 57.7188C0 59.6931 0.765552 61.5466 2.16571 62.9467L28.0635 88.8446C29.4637 90.2447 31.3171 91.0103 33.2915 91.0103C35.2658 91.0103 37.1192 90.2447 38.5194 88.8446L81.2291 46.1348C82.6998 44.6641 83.5057 42.71 83.5057 40.6248V21.8688L75.4371 29.9272Z" fill="currentColor"/>
<path d="M36.5546 37.9721L30.8564 43.6702L47.3383 60.1521L53.0364 54.454L36.5546 37.9721Z" fill="currentColor"/>
<path d="M25.9493 48.5803L20.2512 54.2784L36.733 70.7603L42.4312 65.0621L25.9493 48.5803Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Консультация / Чат (Figma Node 1236:59636) */
export function SimonaIconChat({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 90 83"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M72.3744 18.5529H17.2583V26.58H72.3744V18.5529Z" fill="currentColor"/>
<path d="M52.3066 35.0686H17.2583V43.0957H52.3066V35.0686Z" fill="currentColor"/>
<path d="M79.5888 0H10.0339C4.49518 0 0 4.49518 0 10.0339V56.1797C0 61.7184 4.49518 66.2136 10.0339 66.2136H15.3217V83.0003L45.9552 66.2136H46.0555V58.1865H44.5404C44.119 58.1865 43.7076 58.2969 43.3363 58.4975L23.3488 69.4445V58.1865H10.0339C8.93015 58.1865 8.02711 57.2834 8.02711 56.1797V10.0339C8.02711 8.93015 8.93015 8.02711 10.0339 8.02711H79.5888C80.6925 8.02711 81.5955 8.93015 81.5955 10.0339V56.1797C81.5955 57.2834 80.6925 58.1865 79.5888 58.1865H52.2966V66.2136H79.5888C85.1275 66.2136 89.6226 61.7184 89.6226 56.1797V10.0339C89.6226 4.49518 85.1375 0 79.5888 0Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Доставка / Логистика (Figma Node 1236:59636) */
export function SimonaIconDelivery({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 101 79"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M25.1845 78.8101C18.48 78.8101 13.0157 73.3558 13.0157 66.6413C13.0157 59.9369 18.47 54.4725 25.1845 54.4725C31.899 54.4725 37.3533 59.9268 37.3533 66.6413C37.3533 73.3458 31.899 78.8101 25.1845 78.8101ZM25.1845 62.538C22.9261 62.538 21.0812 64.3729 21.0812 66.6413C21.0812 68.8997 22.9161 70.7446 25.1845 70.7446C27.4529 70.7446 29.2878 68.9097 29.2878 66.6413C29.2878 64.383 27.4529 62.538 25.1845 62.538Z" fill="currentColor"/>
<path d="M79.808 78.8101C73.1035 78.8101 67.6392 73.3558 67.6392 66.6413C67.6392 59.9369 73.0934 54.4725 79.808 54.4725C86.5225 54.4725 91.9768 59.9268 91.9768 66.6413C91.9667 73.3458 86.5124 78.8101 79.808 78.8101ZM79.808 62.538C77.5496 62.538 75.7046 64.3729 75.7046 66.6413C75.7046 68.8997 77.5395 70.7446 79.808 70.7446C82.0764 70.7446 83.9113 68.9097 83.9113 66.6413C83.9012 64.383 82.0663 62.538 79.808 62.538Z" fill="currentColor"/>
<path d="M17.0585 70.6738H6.04911C2.71202 70.6738 0 67.9618 0 64.6247V6.04911C0 2.71202 2.71202 0 6.04911 0H56.7911C60.1282 0 62.8402 2.71202 62.8402 6.04911V50.7319H8.06548V62.6083H17.0585V70.6738ZM8.06548 42.6664H54.7747V8.06548H8.06548V42.6664Z" fill="currentColor"/>
<path d="M62.8402 62.6079H35.6394V70.6734H62.8402V62.6079Z" fill="currentColor"/>
<path d="M94.9509 70.6738H87.944V62.6083H92.9345V47.9796L73.6983 20.7082H58.8075V12.6427H74.7368C76.7027 12.6427 78.5477 13.6005 79.6769 15.2035L99.8809 43.8561C100.607 44.8845 100.99 46.0842 100.99 47.3444V64.6247C101 67.9618 98.2779 70.6738 94.9509 70.6738Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Премиум качество / Звезда (Figma Node 1236:59636) */
export function SimonaIconStar({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 88 85"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M66.8652 83.619L44 71.6563L21.1848 83.649C19.8445 84.3592 18.2141 84.2491 16.9838 83.3689C15.7236 82.4787 15.0934 80.9384 15.3535 79.418L19.6745 53.9823L1.22026 35.9982C0.120012 34.9279 -0.280079 33.3276 0.190028 31.8672C0.660135 30.3969 1.93042 29.3167 3.46077 29.0866L28.9566 25.3658L40.3692 2.24051C41.0493 0.870198 42.4496 0 43.98 0H44.04C45.5603 0.0200045 46.9406 0.8802 47.6108 2.24051L59.0434 25.3658L84.5292 29.0666C86.0395 29.2867 87.3098 30.3469 87.7899 31.7972C88.28 33.2676 87.8799 34.8879 86.7797 35.9682L68.3355 53.9723L72.6965 79.378C72.9466 80.8584 72.3564 82.3587 71.1561 83.2689C69.9059 84.1991 68.2455 84.3392 66.8652 83.619ZM44 62.6142L63.4544 72.8365L59.7436 51.1816L75.4771 35.8381L53.7322 32.6774L44.01 12.9729L34.2878 32.6774L12.5428 35.8381L28.2764 51.1816L24.5656 72.8365L44 62.6142Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Спецпредложение / Скидка (Figma Node 1236:59636) */
export function SimonaIconPercent({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 75 75"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M68.6356 0.656142L0.658698 68.633L6.35727 74.3316L74.3341 6.35472L68.6356 0.656142Z" fill="currentColor"/>
<path d="M15.8663 31.7423C11.7965 31.7423 7.73671 30.1909 4.64404 27.0982C-1.55138 20.9129 -1.55138 10.839 4.64404 4.64361C10.8395 -1.55181 20.9032 -1.55181 27.0987 4.64361C33.2941 10.829 33.2941 20.9028 27.0987 27.0982C23.9959 30.1909 19.9361 31.7423 15.8663 31.7423ZM15.8663 8.05865C13.8616 8.05865 11.867 8.82426 10.3358 10.3454C7.28339 13.3978 7.28339 18.3541 10.3358 21.4065C13.3881 24.4488 18.3445 24.4589 21.3969 21.4065C24.4492 18.3541 24.4492 13.3978 21.3969 10.3454C19.8757 8.81419 17.871 8.05865 15.8663 8.05865Z" fill="currentColor"/>
<path d="M59.1234 74.9998C55.0536 74.9998 50.9938 73.4484 47.9012 70.3558C41.7057 64.1704 41.7057 54.0966 47.9012 47.9012C54.0966 41.7057 64.1603 41.7057 70.3558 47.9012C76.5512 54.0865 76.5512 64.1603 70.3558 70.3558C67.253 73.4484 63.1933 74.9998 59.1234 74.9998ZM59.1234 51.3162C57.1187 51.3162 55.1241 52.0818 53.5929 53.6029C50.5405 56.6553 50.5405 61.6117 53.5929 64.664C56.6453 67.7063 61.6016 67.7164 64.654 64.664C67.7063 61.6117 67.7063 56.6553 64.654 53.6029C63.1328 52.0717 61.1281 51.3162 59.1234 51.3162Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Активная кухня / Шеф (Figma Node 1236:59636) */
export function SimonaIconChef({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 77 80"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M71.4778 79.8214H5.52223V48.0234H13.5546V71.7891H63.4454V48.0234H71.4778V79.8214Z" fill="currentColor"/>
<path d="M77 43.0935H0V19.0366H77V43.0935ZM8.03234 35.0611H68.9677V27.0689H8.03234V35.0611Z" fill="currentColor"/>
<path d="M44.3084 27.0694V19.037C48.1739 19.037 52.0696 17.6715 53.9873 15.6434C55.0115 14.559 55.4432 13.3742 55.3629 11.8983C55.2725 10.3019 54.5195 8.9966 53.3448 8.40422C52.1098 7.78171 50.5736 7.99256 49.0274 8.9966C44.3887 12.0087 42.732 20.6033 42.5111 23.3745L34.5089 22.7419C34.6294 21.2459 35.9045 7.9524 44.6498 2.26952C48.6458 -0.330951 53.1339 -0.702447 56.9794 1.23535C60.7446 3.14303 63.1342 6.9584 63.3952 11.4465C63.6061 15.1213 62.3711 18.4848 59.8409 21.1656C55.7043 25.5131 49.1077 27.0694 44.3084 27.0694Z" fill="currentColor"/>
<path d="M42.5212 39.9209H34.4888V23.2237C34.2077 20.1312 32.531 11.9483 27.9827 8.98637C26.4364 7.98233 24.9002 7.76144 23.6653 8.39399C22.4905 8.98637 21.7375 10.2916 21.6472 11.8881C21.5668 13.364 21.9986 14.5488 23.0227 15.6331C24.9404 17.6613 28.8261 19.0268 32.7017 19.0268V27.0591C27.9023 27.0591 21.3058 25.5029 17.1892 21.1453C14.649 18.4645 13.424 15.101 13.6349 11.4262C13.8859 6.93813 16.2856 3.12277 20.0507 1.21509C23.8862 -0.732756 28.3843 -0.35122 32.3804 2.24925C41.1256 7.93213 42.4007 21.2256 42.5212 22.7217L42.5312 23.0329V39.9209H42.5212Z" fill="currentColor"/>
<path d="M42.5212 48.0234H34.4889V76.7089H42.5212V48.0234Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Корзина покупок (Figma Node 1236:59636) */
export function SimonaIconCart({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 93 80"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M80.6494 62.2435H33.5088C29.4053 62.2435 25.7822 59.4712 24.7113 55.5077L12.0804 8.82759C11.9503 8.34718 11.5099 8.00689 11.0095 8.00689H0V0H11.0095C15.113 0 18.7361 2.77238 19.807 6.73579L32.4279 53.4159C32.558 53.8964 32.9984 54.2367 33.4988 54.2367H80.6494V62.2435Z" fill="currentColor"/>
<path d="M74.9645 48.5116H27.2134V40.5047H74.9645C75.9754 40.5047 76.8661 39.8241 77.1364 38.8433L82.541 18.8561H18.626V10.8492H93.01L84.873 40.925C83.662 45.3889 79.5885 48.5116 74.9645 48.5116Z" fill="currentColor"/>
<path d="M25.0215 79.7384C28.7858 79.7384 31.8374 76.6868 31.8374 72.9225C31.8374 69.1582 28.7858 66.1067 25.0215 66.1067C21.2572 66.1067 18.2057 69.1582 18.2057 72.9225C18.2057 76.6868 21.2572 79.7384 25.0215 79.7384Z" fill="currentColor"/>
<path d="M73.8335 79.7384C77.5978 79.7384 80.6494 76.6868 80.6494 72.9225C80.6494 69.1582 77.5978 66.1067 73.8335 66.1067C70.0692 66.1067 67.0176 69.1582 67.0176 72.9225C67.0176 76.6868 70.0692 79.7384 73.8335 79.7384Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Избранное / Список желаний (Figma Node 1236:59636) */
export function SimonaIconHeart({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 87 78"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M65.3176 0.0902457C59.4815 -0.400262 53.8857 1.19138 49.3611 4.47478C50.8726 6.68707 52.0839 9.19967 52.9848 11.8424C56.4484 8.8393 61.0732 7.44786 65.8581 8.22866C72.3548 9.27975 77.6003 14.4451 78.7515 20.9318C79.6424 25.987 78.1108 30.9822 74.6672 34.5959L69.9524 39.5711C61.1933 48.7706 52.194 58.2704 43.495 67.0695C34.9261 58.4106 26.4273 49.4513 18.1888 40.7623L12.563 34.8362C10.1805 32.3236 8.53883 29.1403 8.12841 25.6967C6.97722 16.1469 14.4249 8.00844 23.7446 8.00844C32.4235 8.00844 39.4808 15.0757 39.4909 23.7547L47.4991 23.7447C47.4891 9.94043 35.6469 -1.15104 21.6023 0.100256C10.8813 1.04123 1.97204 9.30978 0.300311 19.9408C-0.8709 27.4085 1.4515 34.7461 6.52675 40.1016L12.3828 46.268C21.5623 55.958 31.0621 65.9684 40.6621 75.5783L41.9434 76.8597C42.7943 77.7205 44.1857 77.7205 45.0466 76.8597L46.3279 75.5783C55.9579 65.9284 66.4688 54.8469 75.7484 45.0668L80.4632 40.1016C85.5185 34.7861 87.8509 27.4986 86.7297 20.0709C85.098 9.35983 76.1187 1.00119 65.3176 0.0902457Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Фильтры и параметры (Figma Node 1236:59636) */
export function SimonaIconFilter({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 72 81"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M8.08307 38.516H0V80.9521H8.08307V38.516Z" fill="currentColor"/>
<path d="M40.0415 0H31.9585V80.952H40.0415V0Z" fill="currentColor"/>
<path d="M72 22.0972H63.9169V80.9521H72V22.0972Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Гарантия / Одобрено (Figma Node 1236:59636) */
export function SimonaIconGuarantee({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 88 86"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
<path d="M69.9095 85.5367H32.3968C26.0596 85.5367 20.9038 80.3809 20.9038 74.0437V38.4232C20.9038 35.8903 21.9049 33.1772 23.717 30.7845C31.7761 19.8621 37.9932 11.2123 42.6685 4.3845C45.3816 0.249803 49.8567 -1.08171 54.592 0.900542C58.3363 2.46232 61.1695 6.96744 59.3575 12.5738C58.8369 14.1856 57.9759 16.9087 56.9347 20.2025C56.1839 22.5752 55.3529 25.2382 54.4819 27.9713H77.448C80.962 27.9713 83.9554 29.2127 85.8776 31.4653C87.6096 33.4876 88.3104 36.1806 87.8498 39.0539C86.9789 44.0195 86.0378 49.5658 85.0667 55.3424C83.9354 62.04 82.7641 68.9579 81.6027 75.5354L81.5827 75.6555C80.5716 80.5611 76.2366 85.5367 69.9095 85.5367ZM50.4473 8.01863C49.9067 8.01863 49.6464 8.35902 49.316 8.84958C44.5406 15.8175 38.2735 24.5374 30.1242 35.58C29.3534 36.5911 28.9129 37.6423 28.9129 38.4232V74.0537C28.9129 75.9759 30.4746 77.5376 32.3968 77.5376H69.9195C72.0419 77.5376 73.4235 75.5254 73.7438 74.0637C74.8951 67.5363 76.0564 60.6585 77.1877 54.0009C78.1688 48.2143 79.1099 42.648 79.9709 37.7324C80.041 37.2619 79.9909 36.8814 79.8007 36.6612C79.5304 36.3408 78.7495 35.9704 77.458 35.9704H50.3973C48.7654 35.9704 47.2938 35.2195 46.3627 33.9081C45.3916 32.5465 45.1513 30.7445 45.732 29.0926C46.9734 25.2082 48.2348 21.1936 49.316 17.7797C50.3572 14.466 51.2282 11.7128 51.7588 10.091C52.0592 9.17995 51.9691 8.46914 51.5386 8.28894C51.068 8.09872 50.7176 8.01863 50.4473 8.01863ZM53.3506 31.5253C53.3406 31.5554 53.3306 31.5854 53.3206 31.6154C53.3306 31.5954 53.3406 31.5654 53.3506 31.5253Z" fill="currentColor"/>
<path d="M14.8969 85.5367H6.85779C3.07349 85.5367 0 82.4632 0 78.6789V40.6657C0 36.8814 3.07349 33.808 6.85779 33.808H24.9083V41.8171H8.0091V77.5376H14.8969V85.5367Z" fill="currentColor"/>
</g>
    </svg>
  );
}

/** Авторизация / Пользователь (Figma Node 4344:77) */
export function SimonaIconUser({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 800 800"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M399.55 400C359.994 400 321.326 388.27 288.436 366.294C255.546 344.318 229.912 313.082 214.774 276.537C199.637 239.992 195.676 199.778 203.393 160.982C211.11 122.186 230.158 86.5492 258.129 58.5787C286.099 30.6082 321.736 11.5601 360.532 3.84303C399.328 -3.87401 439.542 0.0866562 476.087 15.2242C512.632 30.3617 543.868 55.9962 565.844 88.886C587.82 121.776 599.55 160.444 599.55 200C599.55 253.043 578.479 303.914 540.971 341.421C503.464 378.929 452.593 400 399.55 400ZM399.55 50.0001C369.883 50.0001 340.882 58.7974 316.214 75.2796C291.547 91.7619 272.321 115.189 260.968 142.598C249.615 170.007 246.644 200.166 252.432 229.264C258.22 258.361 272.506 285.088 293.484 306.066C314.462 327.044 341.189 341.33 370.286 347.118C399.384 352.906 429.544 349.935 456.952 338.582C484.361 327.229 507.788 308.003 524.27 283.336C540.753 258.668 549.55 229.667 549.55 200C549.55 160.218 533.746 122.065 505.616 93.9341C477.486 65.8036 439.332 50.0001 399.55 50.0001ZM725 800H75C55.1088 800 36.0323 792.098 21.967 778.033C7.9018 763.968 0 744.891 0 725C0.0661713 665.347 23.7927 608.156 65.974 565.974C108.155 523.793 165.347 500.066 225 500H575C634.653 500.066 691.845 523.793 734.026 565.974C776.207 608.156 799.934 665.347 800 725C800 744.891 792.098 763.968 778.033 778.033C763.968 792.098 744.891 800 725 800ZM225 550C178.587 550 134.075 568.438 101.256 601.256C68.4374 634.075 50 678.587 50 725C50 731.63 52.6339 737.989 57.3223 742.678C62.0107 747.366 68.3696 750 75 750H725C731.63 750 737.989 747.366 742.678 742.678C747.366 737.989 750 731.63 750 725C750 678.587 731.562 634.075 698.744 601.256C665.925 568.438 621.413 550 575 550H225Z" fill="currentColor"/>
    </svg>
  );
}

/** Геолокация / Булавка адреса (Figma Node 4344:79) */
export function SimonaIconPin({ className = 'w-4 h-4', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 852 852"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M425.896 26.5215C264.461 26.5215 133.073 157.962 133.073 319.396C133.073 603.452 409.411 819.395 409.411 819.395C419.119 827.127 432.881 827.127 442.588 819.395C442.588 819.395 718.979 603.452 718.979 319.396C718.978 157.962 587.331 26.5215 425.896 26.5215ZM425.896 186.323C499.103 186.323 559.177 246.189 559.177 319.396C559.177 392.605 499.104 452.625 425.896 452.625C352.688 452.625 292.822 392.605 292.823 319.396C292.823 246.189 352.688 186.323 425.896 186.323Z" fill="currentColor"/>
    </svg>
  );
}

/** Сравнение товаров (Figma Node 1006:69) */
export function SimonaIconCompare({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 143 161"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g>
        <path d="M16.0539 76.497H0V160.78H16.0539V76.497Z" fill="currentColor"/>
        <path d="M79.5269 0H63.4731V160.78H79.5269V0Z" fill="currentColor"/>
        <path d="M143 43.8875H126.946V160.78H143V43.8875Z" fill="currentColor"/>
      </g>
    </svg>
  );
}

/** Часы / Режим работы (Figma Node 4346:82) */
export function SimonaIconClock({ className = 'w-3.5 h-3.5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 884 884"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M441.631 73.666C238.311 73.666 73.6665 238.679 73.6665 441.999C73.6665 645.319 238.311 810.333 441.631 810.333C645.32 810.333 810.333 645.319 810.333 441.999C810.333 238.679 645.32 73.666 441.631 73.666ZM442 736.666C279.196 736.666 147.333 604.803 147.333 441.999C147.333 279.196 279.196 147.333 442 147.333C604.803 147.333 736.667 279.196 736.667 441.999C736.667 604.803 604.803 736.666 442 736.666ZM460.417 257.833H405.167V478.833L598.542 594.858L626.167 549.553L460.417 451.208V257.833Z" fill="currentColor"/>
    </svg>
  );
}

/** Телефонная трубка (Сплошная заливка) */
export function SimonaIconPhoneSolid({ className = 'w-3 h-3', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" fill="currentColor"/>
    </svg>
  );
}

/** Консультация / Сообщения с вопросом (Figma Node 4349:84) */
export function SimonaIconConsultation({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="47 158 747 499"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M398.414 158.258H118.913C79.4283 158.258 47.4854 190.493 47.4854 229.841V419.915C47.4854 457.485 76.5446 488.608 113.59 491.498V543.741C113.59 550.41 117.582 556.635 123.794 559.08C125.79 559.969 128.008 560.414 130.227 560.414C134.663 560.414 138.878 558.636 141.983 555.523L205.647 491.721H370.908V515.952C370.908 555.523 403.073 587.758 442.558 587.758H635.547L699.211 651.561C702.316 654.673 706.753 656.451 710.967 656.451C713.186 656.451 715.182 656.007 717.4 655.118C723.612 652.45 727.604 646.448 727.604 639.778V587.313C764.428 584.423 793.709 553.522 793.709 515.73V325.656C793.709 286.085 761.544 253.851 722.059 253.851H470.064V229.619C470.064 190.27 437.899 158.258 398.414 158.258ZM198.549 458.374C194.112 458.374 189.898 460.153 186.792 463.265L146.642 503.503V475.048C146.642 465.933 139.1 458.374 130.005 458.374H118.913C97.8399 458.374 80.7593 441.257 80.7593 420.137V230.063C80.7593 208.944 97.8399 191.826 118.913 191.826H398.414C419.488 191.826 436.568 208.944 436.568 230.063V420.137C436.568 441.257 419.488 458.374 398.414 458.374H198.549ZM721.837 287.419C742.91 287.419 760.213 304.537 760.213 325.878V515.952C760.213 537.072 743.132 554.412 721.837 554.412H710.746C701.651 554.412 694.109 561.97 694.109 571.085V599.54L653.958 559.303C650.853 556.19 646.638 554.412 642.201 554.412H442.336C421.262 554.412 403.96 537.294 403.96 515.952V491.498C440.783 488.608 469.842 457.707 469.842 420.137V287.641H721.837V287.419Z" fill="currentColor"/>
      <path d="M259.108 391.904C254.671 391.904 250.456 393.683 247.351 396.795C244.245 399.907 242.471 404.131 242.471 408.577C242.471 413.024 244.245 417.247 247.351 420.36C250.456 423.472 254.671 425.251 259.108 425.251C263.544 425.251 267.759 423.472 270.864 420.36C273.97 417.247 275.745 413.024 275.745 408.577C275.745 404.131 273.97 399.907 270.864 396.795C267.759 393.683 263.544 391.904 259.108 391.904Z" fill="currentColor"/>
      <path d="M258.664 224.729C230.27 224.729 206.979 247.849 206.979 276.526V277.638C206.979 286.753 214.521 294.311 223.615 294.311C232.71 294.311 240.252 286.753 240.252 277.638V276.526C240.252 266.523 248.46 258.075 258.664 258.075C268.868 258.075 277.076 266.3 277.076 276.526C277.076 286.308 273.305 295.423 266.428 302.314C251.122 317.654 242.693 338.106 242.693 359.892C242.693 369.007 250.235 376.565 259.329 376.565C268.424 376.565 275.966 369.007 275.966 359.892C275.966 346.998 280.847 334.994 289.941 325.879C303.029 312.763 310.349 295.2 310.349 276.526C310.349 247.849 287.058 224.729 258.664 224.729Z" fill="currentColor"/>
    </svg>
  );
}

/** Фирменный знак СИМОНА (Figma Node 4350:92) */
export function SimonaIconMark({ className = 'w-4 h-4', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 666 482"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M456.922 0.0789557H456.134C447.142 0.0789557 439.807 7.42026 439.807 16.4193V16.4982V87.4642V87.5431C439.807 96.3843 446.905 103.489 455.66 103.805V103.883C522.862 106.015 541.161 129.302 541.161 199.399V282.838C541.161 356.567 520.969 379.38 444.697 379.38H332.852H221.007C144.735 379.38 124.544 356.567 124.544 282.838V199.32C124.544 129.302 142.842 106.015 210.044 103.805V103.726C218.799 103.489 225.898 96.3843 225.898 87.4642V87.3853V16.4193V16.3403C225.898 7.34131 218.562 0 209.571 0H208.782C50.8743 0 0 50.9156 0 178.244V304.625C0 431.953 50.8743 482 208.782 482H332.931H457.08C614.988 482 665.862 431.953 665.862 304.625V178.244C665.704 50.9945 614.83 0.0789557 456.922 0.0789557Z" fill="currentColor"/>
      <path d="M379.074 0.0782125H286.475C277.641 0.0782125 270.463 7.26164 270.463 16.1028V53.5198V234.684V272.101C270.463 280.943 277.641 288.126 286.475 288.126H379.074C387.908 288.126 395.085 280.943 395.085 272.101V234.684V53.4408V16.0238C395.085 7.26162 387.908 0.0782125 379.074 0.0782125Z" fill="currentColor"/>
    </svg>
  );
}

/** Мессенджер MAX */
export function SimonaIconMax({ className = 'w-5 h-5', size, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="24" height="24" rx="6" fill="#5C3BFE"/>
      <path d="M6.5 7.5H8.2L12 12.4L15.8 7.5H17.5V16.5H15.8V10.2L12.5 14.5H11.5L8.2 10.2V16.5H6.5V7.5Z" fill="white"/>
    </svg>
  );
}

/** Поиск / Лупа */
export function SimonaIconSearch({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

/** Удаление / Корзина мусорная */
export function SimonaIconTrash({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

/** Галочка подтверждения */
export function SimonaIconCheck({ className = 'w-4 h-4', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/** Галочка в круге (Success) */
export function SimonaIconCheckCircle({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

/** Премиальный блеск / Искры (Quiet Luxury Spark) */
export function SimonaIconSparkles({ className = 'w-4 h-4', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

/** Товар / Коробка / Наличие */
export function SimonaIconPackage({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

/** Салон / Здание / Шоурум */
export function SimonaIconBuilding({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
      <path d="M9 22v-4h6v4" />
      <path d="M8 6h.01" />
      <path d="M16 6h.01" />
      <path d="M12 6h.01" />
      <path d="M12 10h.01" />
      <path d="M12 14h.01" />
      <path d="M16 10h.01" />
      <path d="M16 14h.01" />
      <path d="M8 10h.01" />
      <path d="M8 14h.01" />
    </svg>
  );
}

/** Документ / Спецификация / PDF */
export function SimonaIconFile({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10 9H8" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  );
}

/** Пламя / Огонь / Варочные панели */
export function SimonaIconFlame({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 3z" />
    </svg>
  );
}

/** Поделиться */
export function SimonaIconShare({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

/** Автомобиль / Парковка */
export function SimonaIconCar({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.7 2 11.3 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

/** Скачать / Загрузка */
export function SimonaIconDownload({ className = 'w-5 h-5', size, color, ...props }: SimonaIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      width={size}
      height={size}
      className={className}
      style={color ? { color } : undefined}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

