const ActiveInstalls = ( props: any ) => {
	const { plugin, showActiveInstalls } = props;
	return (
		<>
			{ showActiveInstalls && (
				<tr>
					<td>Active installs</td>
					<td className="text-end">
						{ plugin.active_installs.toLocaleString() }
					</td>
				</tr>
			) }
		</>
	);
};

export default ActiveInstalls;
