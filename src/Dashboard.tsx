import { v4 as uuidv4 } from 'uuid';
import { useState, useEffect } from 'react';
import { Card } from './Card';

export const Dashboard = () => {
	const [ data, setData ] = useState< any >( null );
	const [ searchField, setSearchField ] = useState( 'SMNTCS' );
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
	url.searchParams.append( 'request[search]', searchField );

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
	}, [ searchField, sortField, sortOrder ] );

	const handelSearch = ( e: any ) => {
		setSearchField( e.target.value );
	};

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
		<div className="container-fluid">
			<div className="row">
				<div className="col-md-3 col-xl-3 col-xxl-2 col-12 m-0 p-0">
					<div className="text-bg-dark p-4 vh-100 sticky-top">
						<h3>Plugin Dashboard</h3>

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
											onChange={ handelSearch }
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
											onChange={ handelSortField }
										>
											<option value="activeInstalls">
												active installs
											</option>
											<option value="downloads">
												downloads
											</option>
											<option value="numberOfRatings">
												number of ratings
											</option>
											<option value="pluginName">
												plugin name
											</option>
											<option value="rating">
												rating
											</option>
											<option value="requiresAtLeast">
												required WordPress version
											</option>
											<option value="requiresPHP">
												required PHP version
											</option>
											<option value="testedUpTo">
												tested up to
											</option>
										</select>
									</p>
									<p>
										<select
											className="form-select"
											aria-label="Select sort order"
											name="sortOrder"
											onChange={ handelSortOrder }
										>
											<option value="desc">desc</option>
											<option value="asc">asc</option>
										</select>
									</p>
								</form>

								<div>
									<label
										htmlFor="sortField"
										className="form-label"
									>
										Show / hide fields
									</label>

									<div className="form-check">
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
									<div className="form-check">
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
									<div className="form-check">
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
									<div className="form-check">
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
									<div className="form-check">
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
									<div className="form-check">
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
									<div className="form-check">
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
									<div className="form-check">
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

				<div className="col-md-9 col-xl-9 col-xxl-10 col-12 m-0 p-0">
					{ data && (
						<div className="container-fluid">
							<div className="row m-0">
								{ data.map( ( plugin: any ) => (
									<Card
										plugin={ plugin }
										key={ uuidv4() }
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
