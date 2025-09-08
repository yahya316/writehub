// // app/layout.js
// import './globals.css';
// import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
// import AuthProvider from '@/components/AuthProvider';

// const inter = Inter({ subsets: ['latin'] });
// const notoSansUrdu = Noto_Nastaliq_Urdu({
//   subsets: ['arabic'], // 'arabic' subset includes the characters needed for Urdu.
//   display: 'swap',
//   variable: '--font-noto-urdu', // Use a CSS variable for easy styling
// });

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body className={`${inter.className} ${notoSansUrdu.variable}`}>
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }



import './globals.css';
import { Inter, Noto_Nastaliq_Urdu } from 'next/font/google';
import AuthProvider from '@/components/AuthProvider';

// Define Inter font for English/Latin text
const inter = Inter({ subsets: ['latin'], display: 'swap' });

// Define Noto Nastaliq Urdu font for Urdu text
const notoSansUrdu = Noto_Nastaliq_Urdu({
  subsets: ['arabic'], // Includes Urdu characters
  display: 'swap',
  variable: '--font-noto-urdu', // CSS variable for Urdu font
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="auto">
      <body className={`${inter.className} ${notoSansUrdu.variable}`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}