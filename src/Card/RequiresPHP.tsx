const RequiresPHP = ( props: any ) => {
	const { plugin, showRequiresPHP } = props;
	return (
		<>
			{ showRequiresPHP && (
				<tr>
					<td>Requires PHP</td>
					<td className="text-end">{ plugin.requires_php }</td>
				</tr>
			) }
		</>
	);
};

export default RequiresPHP;
