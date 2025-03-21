const TestedUpTo = ( props: any ) => {
	const { plugin, showTestedUpTo, currentWPVersion } = props;

	// Helper function to normalize version strings by removing potential beta/RC suffixes
	const normalizeVersionString = ( version: string ): string => {
		// Remove any suffix like -beta1, -RC2, etc.
		return version.replace( /-.*$/, '' );
	};

	// Version comparison function
	const compareVersions = ( v1: string, v2: string ): number => {
		const v1Parts = v1.split( '.' ).map( Number );
		const v2Parts = v2.split( '.' ).map( Number );

		for ( let i = 0; i < Math.max( v1Parts.length, v2Parts.length ); i++ ) {
			const v1Part = v1Parts[ i ] || 0;
			const v2Part = v2Parts[ i ] || 0;

			if ( v1Part !== v2Part ) {
				return v1Part - v2Part;
			}
		}

		return 0;
	};

	const isCompatible = currentWPVersion
		? compareVersions(
				normalizeVersionString( plugin.tested ),
				normalizeVersionString( currentWPVersion )
		  ) >= 0
		: true;

	return (
		<>
			{ showTestedUpTo && (
				<tr>
					<td>Tested up to</td>
					<td className="text-end">
						{ currentWPVersion && (
							<span
								className={ `ms-2 badge ${
									isCompatible ? 'bg-success' : 'bg-danger'
								}` }
							>
								{ isCompatible ? '👍' : '👎' }
							</span>
						) }{ ' ' }
						&nbsp; { plugin.tested }
					</td>
				</tr>
			) }
		</>
	);
};

export default TestedUpTo;
