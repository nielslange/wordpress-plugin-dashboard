const TestedUpTo = ( props: any ) => {
	const { plugin, showTestedUpTo } = props;
	return (
		<>
			{ showTestedUpTo && (
				<tr>
					<td>Tested up to</td>
					<td className="text-end">{ plugin.tested }</td>
				</tr>
			) }
		</>
	);
};

export default TestedUpTo;
