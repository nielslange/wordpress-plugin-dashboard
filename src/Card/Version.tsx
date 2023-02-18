const Version = ( props: any ) => {
	const { plugin, showVersion } = props;
	return (
		<>
			{ showVersion && (
				<tr>
					<td>Version</td>
					<td className="text-end">{ plugin.version }</td>
				</tr>
			) }
		</>
	);
};

export default Version;
