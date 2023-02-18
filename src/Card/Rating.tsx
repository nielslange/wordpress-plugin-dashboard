const Rating = ( props: any ) => {
	const { plugin, showRating } = props;
	return (
		<>
			{ showRating && (
				<tr>
					<td>Rating</td>
					<td className="text-end">{ plugin.rating }</td>
				</tr>
			) }
		</>
	);
};

export default Rating;
