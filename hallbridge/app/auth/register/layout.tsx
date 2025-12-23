export default function RootLayout({children}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body>
        <div>hello from admin RootLayout</div>
        {/* {children} */}
      </body>
    </html>
  );
}
