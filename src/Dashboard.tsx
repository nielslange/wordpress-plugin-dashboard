import { useState, useEffect } from 'react';
import { Card } from './Card';
import React from 'react';

interface Plugin {
	name: string;
	active_installs: number;
	downloaded: number;
	rating: number;
	num_ratings: number;
	requires: string;
	requires_php: string;
	tested: string;
	version: string;
	slug: string;
	short_description: string;
	banners: {
		low: string;
		high: string;
	};
}

export const Dashboard = () => {
	// Add CSS animation styles
	React.useEffect( () => {
		const style = document.createElement( 'style' );
		style.innerHTML = `
			@keyframes spin {
				0% { transform: rotate(0deg); }
				100% { transform: rotate(360deg); }
			}
			.spinner {
				display: inline-block;
				animation: spin 1s linear infinite;
				width: 0.9em;
				height: 0.9em;
				vertical-align: -0.1em;
				margin: 0 0.15em;
				stroke: currentColor;
			}
		`;
		document.head.appendChild( style );

		return () => {
			document.head.removeChild( style );
		};
	}, [] );

	const sortKeyMap: { [ key: string ]: string } = {
		activeInstalls: 'active_installs',
		downloads: 'downloaded',
		testedUpTo: 'tested',
		pluginName: 'name',
		rating: 'rating',
		numberOfRatings: 'num_ratings',
		requiresAtLeast: 'requires',
		requiresPHP: 'requires_php',
		version: 'version',
		wpCompatibility: 'tested', // New sort key for WordPress compatibility
	};

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

	// Helper function to get value from URL parameters or localStorage
	const getInitialValue = ( key: string, defaultValue: string ): string => {
		const params = new URLSearchParams( window.location.search );
		const urlValue = params.get( key );

		if ( urlValue !== null ) {
			// Save to localStorage if it's in URL but not in localStorage
			localStorage.setItem( key, urlValue );
			return urlValue;
		}

		const storedValue = localStorage.getItem( key );
		return storedValue !== null ? storedValue : defaultValue;
	};

	// Helper function to get boolean initial value
	const getInitialBoolValue = (
		key: string,
		defaultValue: boolean
	): boolean => {
		const params = new URLSearchParams( window.location.search );
		const urlValue = params.get( key );

		if ( urlValue !== null ) {
			const boolValue = urlValue === 'true';
			localStorage.setItem( key, boolValue.toString() );
			return boolValue;
		}

		const storedValue = localStorage.getItem( key );
		return storedValue !== null ? storedValue === 'true' : defaultValue;
	};

	// Helper function to update state, localStorage, and URL params
	const updateSetting = ( key: string, value: string | boolean ) => {
		const stringValue = value.toString();

		// Update localStorage
		localStorage.setItem( key, stringValue );

		// Update URL params
		const params = new URLSearchParams( window.location.search );
		params.set( key, stringValue );
		window.history.replaceState(
			{},
			'',
			`${ window.location.pathname }?${ params }`
		);
	};

	const [ data, setData ] = useState< Plugin[] | null >( null );
	const [ downloads, setDownloads ] = useState( 0 );
	const [ installs, setInstalls ] = useState( 0 );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );
	const [ currentWPVersion, setCurrentWPVersion ] = useState( '' );

	const [ searchField, setSearchField ] = useState( () =>
		getInitialValue( 'searchField', 'SMNTCS' )
	);

	const [ sortField, setSortField ] = useState( () =>
		getInitialValue( 'sortField', 'downloads' )
	);

	const [ sortOrder, setSortOrder ] = useState( () =>
		getInitialValue( 'sortOrder', 'desc' )
	);

	const [ showIncompatiblePlugins, setShowIncompatiblePlugins ] = useState(
		() => getInitialBoolValue( 'showIncompatiblePlugins', false )
	);

	const [ showDescription, setShowDescription ] = useState( () =>
		getInitialBoolValue( 'showDescription', true )
	);

	const [ showActiveInstalls, setShowActiveInstalls ] = useState( () =>
		getInitialBoolValue( 'showActiveInstalls', true )
	);

	const [ showDownloads, setShowDownloads ] = useState( () =>
		getInitialBoolValue( 'showDownloads', true )
	);

	const [ showNumberOfRatings, setShowNumberOfRatings ] = useState( () =>
		getInitialBoolValue( 'showNumberOfRatings', true )
	);

	const [ showRating, setShowRating ] = useState( () =>
		getInitialBoolValue( 'showRating', true )
	);

	const [ showRequiresAtLeast, setShowRequiresAtLeast ] = useState( () =>
		getInitialBoolValue( 'showRequiresAtLeast', true )
	);

	const [ showRequiresPHP, setShowRequiresPHP ] = useState( () =>
		getInitialBoolValue( 'showRequiresPHP', true )
	);

	const [ showTestedUpTo, setShowTestedUpTo ] = useState( () =>
		getInitialBoolValue( 'showTestedUpTo', true )
	);

	const [ showVersion, setShowVersion ] = useState( () =>
		getInitialBoolValue( 'showVersion', true )
	);

	const [ outdatedPluginsCount, setOutdatedPluginsCount ] = useState( 0 );

	const [ outdatedCountCalculated, setOutdatedCountCalculated ] =
		useState( false );

	const sortOptions = [
		{
			key: 'activeInstalls',
			label: 'Active Installs',
			visible: showActiveInstalls,
		},
		{ key: 'downloads', label: 'Downloads', visible: showDownloads },
		{
			key: 'numberOfRatings',
			label: 'Number of Ratings',
			visible: showNumberOfRatings,
		},
		{ key: 'pluginName', label: 'Plugin Name', visible: true }, // Always visible
		{ key: 'rating', label: 'Rating', visible: showRating },
		{
			key: 'requiresAtLeast',
			label: 'Required WordPress Version',
			visible: showRequiresAtLeast,
		},
		{
			key: 'requiresPHP',
			label: 'Required PHP Version',
			visible: showRequiresPHP,
		},
		{ key: 'testedUpTo', label: 'Tested Up To', visible: showTestedUpTo },
		{ key: 'version', label: 'Version', visible: showVersion },
	];

	const visibleSortOptions = sortOptions.filter(
		( option ) => option.visible
	);

	const dynamicSort = ( field: any, sortOrder = 'asc' ) => {
		return function ( a: any, b: any ) {
			let result = 0;
			const fieldName = sortKeyMap[ field ] || field;

			// Handle the new sorting option for WordPress compatibility
			if ( field === 'wpCompatibility' && currentWPVersion ) {
				const aTestedVersion = normalizeVersionString( a.tested );
				const bTestedVersion = normalizeVersionString( b.tested );
				const wpVersion = normalizeVersionString( currentWPVersion );

				const aCompatible =
					compareVersions( aTestedVersion, wpVersion ) >= 0;
				const bCompatible =
					compareVersions( bTestedVersion, wpVersion ) >= 0;

				// If sorting ascending, incompatible plugins come first
				// If sorting descending, compatible plugins come first
				if ( aCompatible !== bCompatible ) {
					return sortOrder === 'asc'
						? aCompatible
							? 1
							: -1
						: aCompatible
						? -1
						: 1;
				}

				// If both are compatible or both incompatible, sort by version gap
				const aGap = Math.abs(
					compareVersions( aTestedVersion, wpVersion )
				);
				const bGap = Math.abs(
					compareVersions( bTestedVersion, wpVersion )
				);
				return sortOrder === 'asc' ? aGap - bGap : bGap - aGap;
			}

			if ( field === 'pluginName' || field === 'version' ) {
				result = a[ fieldName ].localeCompare( b[ fieldName ] );
			} else {
				result =
					parseFloat( a[ fieldName ] ) - parseFloat( b[ fieldName ] );
			}
			return sortOrder === 'desc' ? -result : result;
		};
	};

	// Function to fetch current WordPress version
	const fetchCurrentWordPressVersion = async () => {
		try {
			const response = await fetch(
				'https://api.wordpress.org/core/version-check/1.7/'
			);
			if ( ! response.ok ) {
				throw new Error(
					`HTTP error: The status is ${ response.status }`
				);
			}
			const data = await response.json();

			// Current stable version is in the first offer
			return data.offers[ 0 ].current;
		} catch ( error ) {
			console.error( 'Error fetching WordPress version:', error );
			return '';
		}
	};

	// Fetch WordPress version on component mount
	useEffect( () => {
		const getWordPressVersion = async () => {
			const version = await fetchCurrentWordPressVersion();
			setCurrentWPVersion( version );
		};

		getWordPressVersion();
	}, [] );

	let url = new URL( 'https://api.wordpress.org/plugins/info/1.2/' );
	url.searchParams.append( 'action', 'query_plugins' );
	url.searchParams.append( 'request[fields][banners]', 'true' );
	url.searchParams.append( 'request[search]', searchField );

	let plugins;

	// Reset calculation flag only when search field or WP version changes
	useEffect( () => {
		setOutdatedCountCalculated( false );
	}, [ searchField, currentWPVersion ] );

	useEffect( () => {
		// Main data fetching effect
		fetch( url )
			.then( ( response ) => {
				if ( ! response.ok ) {
					throw new Error(
						`HTTP error: The status is ${ response.status }`
					);
				}
				return response.json();
			} )
			.then( ( data ) => {
				plugins = data[ 'plugins' ];

				// Calculate the count of outdated plugins
				if ( currentWPVersion ) {
					const outdatedCount = plugins.filter(
						( plugin: Plugin ) => {
							const pluginTestedVersion = normalizeVersionString(
								plugin.tested
							);
							const wpVersion =
								normalizeVersionString( currentWPVersion );
							return (
								compareVersions(
									pluginTestedVersion,
									wpVersion
								) < 0
							);
						}
					).length;
					setOutdatedPluginsCount( outdatedCount );
					setOutdatedCountCalculated( true );
				}

				// Filter plugins if showIncompatiblePlugins is active
				let filteredPlugins = [ ...plugins ];
				if ( showIncompatiblePlugins && currentWPVersion ) {
					filteredPlugins = filteredPlugins.filter( ( plugin ) => {
						const pluginTestedVersion = normalizeVersionString(
							plugin.tested
						);
						const wpVersion =
							normalizeVersionString( currentWPVersion );
						return (
							compareVersions( pluginTestedVersion, wpVersion ) <
							0
						);
					} );
				}

				const sortedPlugins = [ ...filteredPlugins ].sort(
					dynamicSort( sortField, sortOrder )
				);

				const totals = sortedPlugins.reduce(
					( acc, plugin ) => ( {
						downloads: acc.downloads + plugin.downloaded,
						installs: acc.installs + plugin.active_installs,
					} ),
					{ downloads: 0, installs: 0 }
				);

				setData( sortedPlugins );
				setDownloads( totals.downloads );
				setInstalls( totals.installs );
				setError( null );
			} )
			.catch( ( err ) => {
				setError( err.message );
				setData( null );
			} )
			.finally( () => {
				setLoading( false );
			} );
	}, [
		searchField,
		sortField,
		sortOrder,
		showIncompatiblePlugins,
		currentWPVersion,
	] );

	useEffect( () => {
		if (
			! visibleSortOptions.find( ( option ) => option.key === sortField )
		) {
			setSortField( visibleSortOptions[ 0 ].key );
		}
	}, [
		showActiveInstalls,
		showDownloads,
		showNumberOfRatings,
		showRating,
		showRequiresAtLeast,
		showRequiresPHP,
		showTestedUpTo,
	] );

	const handleSearch = ( e: React.ChangeEvent< HTMLInputElement > ) => {
		const newSearchField = e.target.value;
		setSearchField( newSearchField );
		updateSetting( 'searchField', newSearchField );
	};

	const handleSortField = ( e: React.ChangeEvent< HTMLSelectElement > ) => {
		const newSortField = e.target.value;
		setSortField( newSortField );
		updateSetting( 'sortField', newSortField );
	};

	const handleSortOrder = ( e: React.ChangeEvent< HTMLSelectElement > ) => {
		const newSortOrder = e.target.value;
		setSortOrder( newSortOrder );
		updateSetting( 'sortOrder', newSortOrder );
	};

	const toggleActiveInstalls = () => {
		const currentSetting = ! showActiveInstalls;
		setShowActiveInstalls( currentSetting );
		updateSetting( 'showActiveInstalls', currentSetting );
	};

	const toggleDownloads = () => {
		const currentSetting = ! showDownloads;
		setShowDownloads( currentSetting );
		updateSetting( 'showDownloads', currentSetting );
	};

	const toggleNumberOfRatings = () => {
		const currentSetting = ! showNumberOfRatings;
		setShowNumberOfRatings( currentSetting );
		updateSetting( 'showNumberOfRatings', currentSetting );
	};

	const toggleRating = () => {
		const currentSetting = ! showRating;
		setShowRating( currentSetting );
		updateSetting( 'showRating', currentSetting );
	};

	const toggleRequiresAtLeast = () => {
		const currentSetting = ! showRequiresAtLeast;
		setShowRequiresAtLeast( currentSetting );
		updateSetting( 'showRequiresAtLeast', currentSetting );
	};

	const toggleRequiresPHP = () => {
		const currentSetting = ! showRequiresPHP;
		setShowRequiresPHP( currentSetting );
		updateSetting( 'showRequiresPHP', currentSetting );
	};

	const toggleTestedUpTo = () => {
		const currentSetting = ! showTestedUpTo;
		setShowTestedUpTo( currentSetting );
		updateSetting( 'showTestedUpTo', currentSetting );
	};

	const toggleVersion = () => {
		const currentSetting = ! showVersion;
		setShowVersion( currentSetting );
		updateSetting( 'showVersion', currentSetting );
	};

	const toggleDescription = () => {
		const currentSetting = ! showDescription;
		setShowDescription( currentSetting );
		updateSetting( 'showDescription', currentSetting );
	};

	const toggleShowIncompatiblePlugins = () => {
		const currentSetting = ! showIncompatiblePlugins;
		setShowIncompatiblePlugins( currentSetting );
		updateSetting( 'showIncompatiblePlugins', currentSetting );

		// Don't reset outdatedCountCalculated flag when toggling the checkbox
		// We already have the count calculated, so no need to show spinner again
	};

	console.log( { sortField } );

	return (
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-3 col-xl-3 col-xxl-2 col-12 m-0 p-0 sidebar">
					<div className="p-4 vh-100 sticky-top">
						<h3>WP Plugin Dashboard</h3>

						{ loading && <p>Loading...</p> }
						{ error && (
							<div>{ `There is a problem fetching the post data - ${ error }` }</div>
						) }
						{ data && (
							<>
								<p className="lead">
									The following { data.length } plugins have
									been downloaded{ ' ' }
									<strong>
										{ downloads.toLocaleString() }
									</strong>{ ' ' }
									and installed{ ' ' }
									<strong>
										{ installs.toLocaleString() }
									</strong>{ ' ' }
									times.
								</p>

								<form>
									<p>
										<label
											htmlFor="search"
											className="form-label"
										>
											Search for
										</label>
										<input
											className="form-control"
											type="text"
											name="search"
											id="search"
											placeholder="plugin slug"
											onChange={ handleSearch }
											value={ searchField }
										/>
									</p>
									<p>
										<label
											htmlFor="sortField"
											className="form-label"
										>
											Sort by
										</label>
										<select
											className="form-select"
											aria-label="Select sort field"
											name="sortField"
											onChange={ handleSortField }
											value={ sortField }
										>
											{ visibleSortOptions.map(
												( option ) => (
													<option
														key={ option.key }
														value={ option.key }
													>
														{ option.label }
													</option>
												)
											) }
										</select>
									</p>
									<p>
										<select
											className="form-select"
											aria-label="Select sort order"
											name="sortOrder"
											onChange={ handleSortOrder }
											value={ sortOrder }
										>
											<option value="desc">↓ desc</option>
											<option value="asc">↑ asc</option>
										</select>
									</p>
								</form>

								{ ! loading && currentWPVersion && (
									<div className="mt-4 pt-3">
										<div className="mb-2 small">
											Current version:{ ' ' }
											<span className="fw-bold">
												{ currentWPVersion }
											</span>
										</div>

										<div className="form-check form-switch">
											<input
												className="form-check-input"
												type="checkbox"
												id="showIncompatiblePlugins"
												name="showIncompatiblePlugins"
												checked={
													showIncompatiblePlugins
												}
												onChange={
													toggleShowIncompatiblePlugins
												}
											/>
											<label
												className="form-check-label"
												htmlFor="showIncompatiblePlugins"
											>
												Show outdated plugins
												{ ! outdatedCountCalculated ? (
													<>
														{ ' ' }
														(
														<svg
															className="spinner"
															viewBox="0 0 24 24"
														>
															<circle
																cx="12"
																cy="12"
																r="10"
																fill="none"
																stroke="currentColor"
																strokeWidth="3"
																opacity="0.25"
															/>
															<path
																d="M12 2 A 10 10 0 0 1 22 12"
																fill="none"
																stroke="currentColor"
																strokeWidth="3"
																strokeLinecap="round"
															/>
														</svg>
														)
													</>
												) : (
													` (${ outdatedPluginsCount })`
												) }
											</label>
										</div>
									</div>
								) }

								<br />

								<div>
									<label
										htmlFor="sortField"
										className="form-label"
									>
										Show / hide fields
									</label>
									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="description"
											name="description"
											checked={ showDescription }
											onChange={ toggleDescription }
										/>
										<label
											className="form-check-label"
											htmlFor="description"
										>
											Description
										</label>
									</div>

									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="activeInstalls"
											name="activeInstalls"
											checked={ showActiveInstalls }
											onChange={ toggleActiveInstalls }
										/>
										<label
											className="form-check-label"
											htmlFor="activeInstalls"
										>
											Active installs
										</label>
									</div>
									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="downloads"
											name="downloads"
											checked={ showDownloads }
											onChange={ toggleDownloads }
										/>
										<label
											className="form-check-label"
											htmlFor="downloads"
										>
											Downloads
										</label>
									</div>
									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="numberOfRatings"
											name="numberOfRatings"
											checked={ showNumberOfRatings }
											onChange={ toggleNumberOfRatings }
										/>
										<label
											className="form-check-label"
											htmlFor="numberOfRatings"
										>
											Number of ratings
										</label>
									</div>
									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="rating"
											name="rating"
											checked={ showRating }
											onChange={ toggleRating }
										/>
										<label
											className="form-check-label"
											htmlFor="rating"
										>
											Rating
										</label>
									</div>
									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="requiresAtLeast"
											name="requiresAtLeast"
											checked={ showRequiresAtLeast }
											onChange={ toggleRequiresAtLeast }
										/>
										<label
											className="form-check-label"
											htmlFor="requiresAtLeast"
										>
											Requires at least
										</label>
									</div>
									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="requiresPHP"
											name="requiresPHP"
											checked={ showRequiresPHP }
											onChange={ toggleRequiresPHP }
										/>
										<label
											className="form-check-label"
											htmlFor="requiresPHP"
										>
											Requires PHP
										</label>
									</div>
									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="testedUpTo"
											name="testedUpTo"
											checked={ showTestedUpTo }
											onChange={ toggleTestedUpTo }
										/>
										<label
											className="form-check-label"
											htmlFor="testedUpTo"
										>
											Tested up to
										</label>
									</div>
									<div className="form-check form-switch">
										<input
											className="form-check-input"
											type="checkbox"
											id="version"
											name="version"
											checked={ showVersion }
											onChange={ toggleVersion }
										/>
										<label
											className="form-check-label"
											htmlFor="version"
										>
											Version
										</label>
									</div>
								</div>
							</>
						) }
					</div>
				</div>

				<div className="col-md-9 col-xl-9 col-xxl-10 col-12 m-0 p-0 main">
					{ data && (
						<div className="container-fluid">
							<div className="row m-0">
								{ data.map( ( plugin: any ) => (
									<Card
										key={ plugin.slug }
										plugin={ plugin }
										showDescription={ showDescription }
										showActiveInstalls={
											showActiveInstalls
										}
										showDownloads={ showDownloads }
										showNumberOfRatings={
											showNumberOfRatings
										}
										showRating={ showRating }
										showRequiresAtLeast={
											showRequiresAtLeast
										}
										showRequiresPHP={ showRequiresPHP }
										showTestedUpTo={ showTestedUpTo }
										showVersion={ showVersion }
										currentWPVersion={ currentWPVersion }
									/>
								) ) }
							</div>
						</div>
					) }
				</div>
			</div>
		</div>
	);
};
