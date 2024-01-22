import CApp from "../components/CApp";

export const metadata = {
  title: "Chunithm Singapore Official Site",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      style={{ marginLeft: "calc(100vw - 100%)", marginRight: "0" }}
    >
      <body style={{ maxWidth: "1200px", margin: "0 auto", padding: "8px" }}>
        <CApp>{children}</CApp>
      </body>
    </html>
  );
}
