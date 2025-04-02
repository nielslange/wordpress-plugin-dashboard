import { FontAwesomeIcon } from '../FontAwesome';
import { faCommenting } from '@fortawesome/free-solid-svg-icons';

const NumberOfRatings = ( props: any ) => {
	const { plugin, showNumberOfRatings } = props;
	return (
		<>
			{ showNumberOfRatings && (
				<tr>
					<td>
						<abbr title="Number of ratings">
							<FontAwesomeIcon
								icon={ faCommenting }
								className="me-2"
							/>
						</abbr>
					</td>
					<td className="text-end">{ plugin.num_ratings }</td>
				</tr>
			) }
		</>
	);
};

export default NumberOfRatings;
