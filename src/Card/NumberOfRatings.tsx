const NumberOfRatings = ( props: any ) => {
	const { plugin, showNumberOfRatings } = props;
	return (
		<>
			{ showNumberOfRatings && (
				<tr>
					<td>Number of ratings</td>
					<td className="text-end">{ plugin.num_ratings }</td>
				</tr>
			) }
		</>
	);
};

export default NumberOfRatings;
