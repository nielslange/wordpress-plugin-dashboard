import { FontAwesomeIcon } from '../FontAwesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Rating = ( props: any ) => {
	const { plugin, showRating } = props;
	return (
		<>
			{ showRating && (
				<tr>
					<td>
						<abbr title="Rating">
							<FontAwesomeIcon icon={ faStar } className="me-2" />
						</abbr>
					</td>
					<td className="text-end">{ plugin.rating }</td>
				</tr>
			) }
		</>
	);
};

export default Rating;
