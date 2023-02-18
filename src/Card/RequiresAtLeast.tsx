const RequiresAtLeast = ( props: any ) => {
	const { plugin, showRequiresAtLeast } = props;
	return (
		<>
			{ showRequiresAtLeast && (
				<tr>
					<td>Requires at least</td>
					<td className="text-end">{ plugin.requires }</td>
				</tr>
			) }
		</>
	);
};

export default RequiresAtLeast;
