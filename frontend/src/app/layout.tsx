import NextTopLoader from 'nextjs-toploader';

import { twMerge } from 'tailwind-merge';

import ScrollToTop from '@components/ScrollToTop';

import metadataConfig from '../metadata';
import App from './App';
import { exo, spaceGrotesk, spaceMono } from './fonts';
import './globals.css';

export const metadata = metadataConfig;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
	title: string;
	data: number;
}>) {
	return (
		<html lang="en">
			<body
				id="app"
				className={twMerge(
					spaceGrotesk.variable,
					exo.variable,
					spaceMono.variable,
					'overscroll-none bg-neutral1000'
				)}
			>
				<App>
					<NextTopLoader color="#00E1FF" showSpinner={false} />
					<ScrollToTop />
					{children}
				</App>
			</body>
		</html>
	);
}
