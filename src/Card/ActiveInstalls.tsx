import { FontAwesomeIcon } from '../FontAwesome';
import { faServer } from '@fortawesome/free-solid-svg-icons';

const ActiveInstalls = ( props: any ) => {
	const { plugin, showActiveInstalls } = props;
	return (
		<>
			{ showActiveInstalls && (
				<tr>
					<td>
						<abbr title="Active Installs">
							<FontAwesomeIcon
								icon={ faServer }
								className="me-2"
							/>
						</abbr>
					</td>
					<td className="text-end">
						{ plugin.active_installs.toLocaleString() }
					</td>
				</tr>
			) }
		</>
	);
};

export default ActiveInstalls;
