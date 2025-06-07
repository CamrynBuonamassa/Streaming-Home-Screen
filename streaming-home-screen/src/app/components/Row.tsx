'use client';

import { useEffect, useRef } from 'react';
import Tile from './Tile';

export default function Row({
	title,
	items,
	activeTileIndex,
	isActive,
}: {
	title: string;
	items: any[];
	activeTileIndex: number;
	isActive: boolean;
}) {
	const rowRef = useRef<HTMLDivElement>(null);

	// Scroll to the active row when it becomes active
	useEffect(() => {
		if (isActive && rowRef.current) {
			rowRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			});
		}
	}, [isActive]);

	return (
		<section ref={rowRef}>
			<h2>{title}</h2>
			<div className='row-container'>
				{items.map((item, i) => {
					let imageUrl = getImageUrl(item, title);
					const titleText = getTitleText(item, title);

					return (
						imageUrl &&
						titleText && (
							<Tile
								key={i}
								imageUrl={imageUrl}
								title={titleText}
								isActive={i === activeTileIndex}
							/>
						)
					);
				})}
			</div>
		</section>
	);
}

function getImageUrl(item: any, title: string) {
	let url: string;

	// Get image URL from different item types
	if (title === 'Collections') {
		url = item.image.tile['1.78'].default?.default?.url;
	} else url = item.image.tile['1.78'].program?.default?.url;

	if (!url) {
		url = item.image.tile['1.78'].series?.default?.url;
	}

	return url;
}

function getTitleText(item: any, title: string) {
	let text: string;

	// Get title text from different item types
	if (title === 'Collections') {
		text = item.text.title.full.collection?.default?.content;
	} else text = item.text.title.full.program?.default?.content;

	if (!text) {
		text = item.text.title.full.series?.default?.content;
	}

	return text;
}
