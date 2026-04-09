import { Patrick_Hand } from 'next/font/google';
import './globals.css';

const patrickHand = Patrick_Hand({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: 'Hangman Game',
  description: 'Classic Hangman word game',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={patrickHand.className}>
      <body>{children}</body>
    </html>
  );
}
