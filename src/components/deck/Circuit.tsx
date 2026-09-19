export default function Circuit(){return (
<svg className="bgcirc" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
<defs><pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#e3e3e3"/></pattern></defs>
<rect x="1040" y="30" width="200" height="120" fill="url(#dots)"/><rect x="40" y="520" width="220" height="140" fill="url(#dots)"/>
<g stroke="#e0e0e0" strokeWidth="2" fill="none" strokeLinecap="round">
<path d="M0 90 H120 L160 130 H260"/><path d="M0 140 H90 L130 180 H210"/><path d="M1280 600 H1160 L1120 560 H1020"/><path d="M1280 650 H1190 L1150 690"/>
<path d="M1100 0 V60 L1140 100 V160"/><path d="M180 720 V660 L220 620 V560"/>
</g>
<g fill="#fff" stroke="#e0e0e0" strokeWidth="2"><circle cx="260" cy="130" r="5"/><circle cx="210" cy="180" r="5"/><circle cx="1020" cy="560" r="5"/><circle cx="1140" cy="160" r="5"/><circle cx="220" cy="560" r="5"/></g>
<g fill="#ffd7d8"><circle cx="1150" cy="690" r="5"/><circle cx="120" cy="90" r="5"/></g>
</svg>
);}
