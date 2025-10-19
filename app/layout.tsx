export const metadata = {
  title: "Screenshot Provenance Whisperer",
  description: "Makes the correction travel with the screenshot.",
};

import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
