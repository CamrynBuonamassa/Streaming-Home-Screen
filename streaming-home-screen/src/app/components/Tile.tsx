'use client';

import { useEffect, useRef } from 'react';

export default function Tile({
	imageUrl,
	title,
	isActive,
}: {
	imageUrl: string;
	title: string;
	isActive: boolean;
}) {
	const tileRef = useRef<HTMLDivElement>(null);

	// Scroll to the active tile when it becomes active
	useEffect(() => {
		if (isActive && tileRef.current) {
			tileRef.current.scrollIntoView({
				behavior: 'smooth',
				inline: 'center',
				block: 'center',
			});
		}
	}, [isActive]);

	return (
		<div
			ref={tileRef}
			className={`tile ${isActive ? 'active' : ''}`}
		>
			<img
				src={imageUrl}
				alt={title}
			/>
		</div>
	);
}
