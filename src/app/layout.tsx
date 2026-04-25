import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aegis Prime | Smart Fire Detection & Rescue',
  description: 'Futuristic real-time emergency control dashboard for fire detection and autonomous rescue.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-[#111417] text-white selection:bg-[#5EDEFF] selection:text-black">
        {children}
      </body>
    </html>
  );
}
