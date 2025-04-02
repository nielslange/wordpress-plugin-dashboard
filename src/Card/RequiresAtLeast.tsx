import { FontAwesomeIcon } from '../FontAwesome';
import { faGear } from '@fortawesome/free-solid-svg-icons';

const RequiresAtLeast = ( props: any ) => {
	const { plugin, showRequiresAtLeast } = props;
	return (
		<>
			{ showRequiresAtLeast && (
				<tr>
					<td>
						<abbr title="Requires at least">
							<FontAwesomeIcon icon={ faGear } className="me-2" />
						</abbr>
					</td>
					<td className="text-end">{ plugin.requires }</td>
				</tr>
			) }
		</>
	);
};

export default RequiresAtLeast;
