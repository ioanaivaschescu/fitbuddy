import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext
} from 'next/document'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    return (
      <Html className="min-h-full" lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossOrigin=""
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body className="font-inter min-h-full bg-gray-50 text-gray-900 selection:bg-pink-400 selection:text-white dark:bg-gray-900 dark:text-gray-50 selection:dark:bg-yellow-500">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
