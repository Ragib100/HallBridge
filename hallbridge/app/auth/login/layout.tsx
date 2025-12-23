export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <div>hello from login RootLayout</div>
        {children}
      </body>
    </html>
  );
}
