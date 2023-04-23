import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ItemsContextProvider } from '@/contexts/ItemsContext';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ItemsContextProvider>
            <Component {...pageProps} />
        </ItemsContextProvider>
    )
}
