const Downloads = ( props: any ) => {
	const { plugin, showDownloads } = props;
	return (
		<>
			{ showDownloads && (
				<tr>
					<td>Downloads</td>
					<td className="text-end">
						{ plugin.downloaded.toLocaleString() }
					</td>
				</tr>
			) }
		</>
	);
};

export default Downloads;
