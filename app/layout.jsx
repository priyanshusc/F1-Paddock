import '../styles/globals.css';

export const metadata = {
  title: "Priyanshu's Pit Wall · F1 2026",
  description: 'Personal F1 dashboard — Drivers, Constructors, Paddock, Calendar',
  robots: 'noindex, nofollow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}
