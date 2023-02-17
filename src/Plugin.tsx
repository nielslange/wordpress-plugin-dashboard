function Plugin( props: any ) {
	const {
		plugin,
		showActiveInstalls,
		showDownloads,
		showNumberOfRatings,
		showRating,
		showRequiresAtLeast,
		showRequiresPHP,
		showTestedUpTo,
		showVersion,
	} = props;

	return (
		<div className="pluginCard">
			<div className="pluginCardBanner">
				<img src={ plugin.banners[ 'low' ] } alt={ plugin.name } />
			</div>
			<div className="pluginCardContent">
				<h2>{ plugin.name }</h2>
				<p>{ plugin.short_description }</p>
				<table>
					<tbody>
						{ showActiveInstalls && (
							<tr>
								<td>Active installs</td>
								<td>
									{ plugin.active_installs.toLocaleString() }
								</td>
							</tr>
						) }
						{ showDownloads && (
							<tr>
								<td>Downloads</td>
								<td>{ plugin.downloaded.toLocaleString() }</td>
							</tr>
						) }
						{ showNumberOfRatings && (
							<tr>
								<td>Number of ratings</td>
								<td>{ plugin.num_ratings }</td>
							</tr>
						) }
						{ showRating && (
							<tr>
								<td>Rating</td>
								<td>{ plugin.rating }</td>
							</tr>
						) }
						{ showRequiresAtLeast && (
							<tr>
								<td>Requires at least</td>
								<td>{ plugin.requires }</td>
							</tr>
						) }
						{ showRequiresPHP && (
							<tr>
								<td>Requires PHP</td>
								<td>{ plugin.requires_php }</td>
							</tr>
						) }
						{ showTestedUpTo && (
							<tr>
								<td>Tested up to</td>
								<td>{ plugin.tested }</td>
							</tr>
						) }
						{ showVersion && (
							<tr>
								<td>Version</td>
								<td>{ plugin.version }</td>
							</tr>
						) }
					</tbody>
				</table>
			</div>
		</div>
	);
}

export default Plugin;
