'use client';

import { useEffect, useState } from 'react';
import Row from '../app/components/Row';
import './styles/page.css';

export default function HomePage() {
	const [rows, setRows] = useState<any[]>([]);
	const [activeRowIndex, setActiveRowIndex] = useState(0);
	const [activeTileIndex, setActiveTileIndex] = useState(0);

	useEffect(() => {
		const fetchHome = async () => {
			const res = await fetch(
				'https://cd-static.bamgrid.com/dp-117731241344/home.json'
			);
			const data = await res.json();
			const containers = data.data.StandardCollection.containers;

			containers.map((container: any) => {
				if (!container.set.items) {
					const refId = container.set.refId;
					fetch(
						`https://cd-static.bamgrid.com/dp-117731241344/sets/${refId}.json`
					)
						.then((res) => res.json())
						.then((data) => {
							data = data.data;
							// Get row data from different set types
							if (Object.hasOwn(data, 'CuratedSet')) {
								setRows((prevRows) => [
									...prevRows,
									data.CuratedSet,
								]);
							} else if (Object.hasOwn(data, 'TrendingSet')) {
								setRows((prevRows) => [
									...prevRows,
									data.TrendingSet,
								]);
							} else if (
								Object.hasOwn(data, 'PersonalizedCuratedSet')
							) {
								setRows((prevRows) => [
									...prevRows,
									data.PersonalizedCuratedSet,
								]);
							}
						});
				} else if (container.set.items) {
					setRows((prevRows) => [...prevRows, container.set]);
				}
			});
		};

		fetchHome();
	}, []);

	// Track active row and tile index to allow for navigation with arrow keys
	const handleKeyDown = (event: KeyboardEvent) => {
		event.preventDefault();

		if (event.key === 'ArrowDown') {
			setActiveRowIndex((prev) => Math.min(prev + 1, rows.length - 1));
			setActiveTileIndex(0); // Reset tile index when moving rows
		} else if (event.key === 'ArrowUp') {
			setActiveRowIndex((prev) => Math.max(prev - 1, 0));
			setActiveTileIndex(0); // Reset tile index when moving rows
		} else if (event.key === 'ArrowRight') {
			setActiveTileIndex((prev) => {
				const maxIndex = rows[activeRowIndex]?.items.length - 1 || 0;
				return Math.min(prev + 1, maxIndex);
			});
		} else if (event.key === 'ArrowLeft') {
			setActiveTileIndex((prev) => Math.max(prev - 1, 0));
		}
	};

	useEffect(() => {
		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [rows, activeRowIndex]);

	return (
		<main className='page-container'>
			{rows.map((row, i) => (
				<Row
					key={i}
					title={row.text.title.full.set.default.content}
					items={row.items}
					// Pass active tile index only for the active row so we don't highlight the tile index for all rows
					activeTileIndex={
						i === activeRowIndex ? activeTileIndex : -1
					}
					isActive={i === activeRowIndex} // Indicate if the row is active for scrolling purposes
				/>
			))}
		</main>
	);
}
