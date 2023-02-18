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

	const decodeHTML = function ( html: any ) {
		var txt = document.createElement( 'textarea' );
		txt.innerHTML = html;
		return txt.value;
	};

	const pluginLink = `https://wordpress.org/plugins/${ plugin.slug }`;

	return (
		<div className="col-sm-12 col-md-6 col-lg-4 col-xxl-3 px-2 py-3">
			<div className="card">
				<a href={ pluginLink } target="_blank">
					<img
						src={ plugin.banners[ 'low' ] }
						alt={ decodeHTML( plugin.name ) }
						className="card-img-top"
					/>
				</a>
				<div className="card-body">
					<h5 className="card-title">
						{ decodeHTML( plugin.name ) }
					</h5>
					<p className="card-text">
						{ decodeHTML( plugin.short_description ) }
					</p>

					<table className="table">
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
									<td>
										{ plugin.downloaded.toLocaleString() }
									</td>
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
		</div>
	);
}

export default Plugin;
