import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import Plugin from './Plugin';

function Dashboard() {
	const [ data, setData ] = useState< any >( null );
	const [ sortField, setSortField ] = useState( 'downloads' );
	const [ sortOrder, setSortOrder ] = useState( 'desc' );
	const [ showActiveInstalls, setShowActiveInstalls ] = useState( true );
	const [ showDownloads, setShowDownloads ] = useState( true );
	const [ showTestedUpTo, setShowTestedUpTo ] = useState( true );
	const [ showRequiresAtLeast, setShowRequiresAtLeast ] = useState( true );
	const [ showRequiresPHP, setShowRequiresPHP ] = useState( true );
	const [ showVersion, setShowVersion ] = useState( true );
	const [ showRating, setShowRating ] = useState( true );
	const [ showNumberOfRatings, setShowNumberOfRatings ] = useState( true );
	const [ downloads, setDowloads ] = useState( 0 );
	const [ installs, setInstalls ] = useState( 0 );
	const [ loading, setLoading ] = useState( true );
	const [ error, setError ] = useState( null );

	let url = new URL( 'https://api.wordpress.org/plugins/info/1.2/' );
	url.searchParams.append( 'action', 'query_plugins' );
	url.searchParams.append( 'request[fields][banners]', 'true' );
	url.searchParams.append( 'request[search]', 'smntcs' );

	let plugins;
	let downloadCount = 0;
	let installCount = 0;

	useEffect( () => {
		fetch( url )
			.then( ( response ) => {
				if ( ! response.ok ) {
					throw new Error(
						`This is an HTTP error: The status is ${ response.status }`
					);
				}
				return response.json();
			} )
			.then( ( data ) => {
				plugins = data[ 'plugins' ];

				if ( sortOrder === 'desc' ) {
					switch ( sortField ) {
						case 'activeInstalls':
							plugins.sort( ( a: any, b: any ) =>
								a.active_installs < b.active_installs ? 1 : -1
							);
						case 'downloads':
							plugins.sort( ( a: any, b: any ) =>
								a.downloaded < b.downloaded ? 1 : -1
							);
							break;
						case 'testedUpTo':
							plugins.sort( ( a: any, b: any ) =>
								a.tested < b.tested ? 1 : -1
							);
							break;
						case 'pluginName':
							plugins.sort( ( a: any, b: any ) =>
								b.name.localeCompare( a.name )
							);
							break;
						case 'rating':
							plugins.sort( ( a: any, b: any ) =>
								a.rating < b.rating ? 1 : -1
							);
							break;
						case 'numberOfRatings':
							plugins.sort( ( a: any, b: any ) =>
								a.num_ratings < b.num_ratings ? 1 : -1
							);
							break;
						case 'requiresAtLeast':
							plugins.sort( ( a: any, b: any ) =>
								a.requires < b.requires ? 1 : -1
							);
							break;
						case 'requiresPHP':
							plugins.sort( ( a: any, b: any ) =>
								a.requires_php < b.requires_php ? 1 : -1
							);
							break;
					}
				} else {
					switch ( sortField ) {
						case 'activeInstalls':
							plugins.sort( ( a: any, b: any ) =>
								a.active_installs > b.active_installs ? 1 : -1
							);
						case 'downloads':
							plugins.sort( ( a: any, b: any ) =>
								a.downloaded > b.downloaded ? 1 : -1
							);
							break;
						case 'testedUpTo':
							plugins.sort( ( a: any, b: any ) =>
								a.tested < b.tested ? 1 : -1
							);
							break;
						case 'pluginName':
							plugins.sort( ( a: any, b: any ) =>
								a.name.localeCompare( b.name )
							);
							break;
						case 'rating':
							plugins.sort( ( a: any, b: any ) =>
								a.rating > b.rating ? 1 : -1
							);
							break;
						case 'numberOfRatings':
							plugins.sort( ( a: any, b: any ) =>
								a.num_ratings > b.num_ratings ? 1 : -1
							);
							break;
						case 'requiresAtLeast':
							plugins.sort( ( a: any, b: any ) =>
								a.requires > b.requires ? 1 : -1
							);
							break;
						case 'requiresPHP':
							plugins.sort( ( a: any, b: any ) =>
								a.requires_php > b.requires_php ? 1 : -1
							);
							break;
					}
				}

				plugins.forEach( ( plugin: any ) => {
					downloadCount += plugin.downloaded;
					installCount += plugin.active_installs;
				} );

				setData( plugins );
				setDowloads( downloadCount );
				setInstalls( installCount );
				setError( null );
			} )
			.catch( ( err ) => {
				setError( err.message );
				setData( null );
			} )
			.finally( () => {
				setLoading( false );
			} );
	}, [ sortField, sortOrder ] );

	const handelSortField = ( e: any ) => {
		setSortField( e.target.value );
	};

	const handelSortOrder = ( e: any ) => {
		setSortOrder( e.target.value );
	};

	const toggleActiveInstalls = () => {
		setShowActiveInstalls( ! showActiveInstalls );
	};

	const toggleDownloads = () => {
		setShowDownloads( ! showDownloads );
	};

	const toggleTestedUpTo = () => {
		setShowTestedUpTo( ! showTestedUpTo );
	};

	const toggleRating = () => {
		setShowRating( ! showRating );
	};

	const toggleNumberOfRatings = () => {
		setShowNumberOfRatings( ! showNumberOfRatings );
	};

	const toggleRequiresAtLeast = () => {
		setShowRequiresAtLeast( ! showRequiresAtLeast );
	};

	const toggleRequiresPHP = () => {
		setShowRequiresPHP( ! showRequiresPHP );
	};

	const toggleVersion = () => {
		setShowVersion( ! showVersion );
	};

	return (
		<div id="dashboard">
			<h1>Plugin Dashboard</h1>
			{ loading && <p>Loading...</p> }
			{ error && (
				<div>{ `There is a problem fetching the post data - ${ error }` }</div>
			) }
			{ data && (
				<>
					<p>
						The following { data.length } plugins have been
						downloaded { downloads.toLocaleString() } and installed{ ' ' }
						{ installs.toLocaleString() } times.
					</p>
					<p>
						Sort by{ ' ' }
						<select name="sortField" onChange={ handelSortField }>
							<option value="activeInstalls">
								active installs
							</option>
							<option value="downloads">downloads</option>
							<option value="numberOfRatings">
								number of ratings
							</option>
							<option value="pluginName">plugin name</option>
							<option value="rating">rating</option>
							<option value="requiresAtLeast">
								required WordPress version
							</option>
							<option value="requiresPHP">
								required PHP version
							</option>
							<option value="testedUpTo">tested up to</option>
						</select>{ ' ' }
						<select name="sortOrder" onChange={ handelSortOrder }>
							<option value="desc">desc</option>
							<option value="asc">asc</option>
						</select>{ ' ' }
						Show
						<input
							type="checkbox"
							name="activeInstalls"
							id="activeInstalls"
							checked={ showActiveInstalls }
							onChange={ toggleActiveInstalls }
						/>
						<label htmlFor="activeInstalls">Active installs</label>
						<input
							type="checkbox"
							name="downloads"
							id="downloads"
							checked={ showDownloads }
							onChange={ toggleDownloads }
						/>
						<label htmlFor="downloads">Downloads</label>
						<input
							type="checkbox"
							name="numberOfRatings"
							id="numberOfRatings"
							checked={ showNumberOfRatings }
							onChange={ toggleNumberOfRatings }
						/>
						<label htmlFor="numberOfRatings">
							Number of ratings
						</label>
						<input
							type="checkbox"
							name="rating"
							id="rating"
							checked={ showRating }
							onChange={ toggleRating }
						/>
						<label htmlFor="rating">Rating</label>
						<input
							type="checkbox"
							name="requiresAtLeast"
							id="requiresAtLeast"
							checked={ showRequiresAtLeast }
							onChange={ toggleRequiresAtLeast }
						/>
						<label htmlFor="requiresAtLeast">
							Requires at least
						</label>
						<input
							type="checkbox"
							name="requiresPHP"
							id="requiresPHP"
							checked={ showRequiresPHP }
							onChange={ toggleRequiresPHP }
						/>
						<label htmlFor="requiresPHP">Requires PHP</label>
						<input
							type="checkbox"
							name="testedUpTo"
							id="testedUpTo"
							checked={ showTestedUpTo }
							onChange={ toggleTestedUpTo }
						/>
						<label htmlFor="testedUpTo">Tested up to</label>
						<input
							type="checkbox"
							name="version"
							id="version"
							checked={ showVersion }
							onChange={ toggleVersion }
						/>
						<label htmlFor="version">Version</label>
					</p>
					<div className="pluginCards">
						{ data.map( ( plugin: any ) => (
							<Plugin
								plugin={ plugin }
								key={ uuidv4() }
								showActiveInstalls={ showActiveInstalls }
								showDownloads={ showDownloads }
								showNumberOfRatings={ showNumberOfRatings }
								showRating={ showRating }
								showRequiresAtLeast={ showRequiresAtLeast }
								showRequiresPHP={ showRequiresPHP }
								showTestedUpTo={ showTestedUpTo }
								showVersion={ showVersion }
							/>
						) ) }
					</div>
				</>
			) }
		</div>
	);
}

export default Dashboard;
