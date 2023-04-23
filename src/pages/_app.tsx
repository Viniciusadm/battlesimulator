import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { SnackbarProvider } from 'notistack';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <SnackbarProvider
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            maxSnack={2}
        >
            <Component {...pageProps} />
        </SnackbarProvider>
    )
}
