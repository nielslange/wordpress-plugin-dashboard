import { FontAwesomeIcon } from '../FontAwesome';
import { faCode } from '@fortawesome/free-solid-svg-icons';

const RequiresPHP = ( props: any ) => {
	const { plugin, showRequiresPHP } = props;
	return (
		<>
			{ showRequiresPHP && (
				<tr>
					<td>
						<abbr title="Requires PHP">
							<FontAwesomeIcon icon={ faCode } className="me-2" />
						</abbr>
					</td>
					<td className="text-end">{ plugin.requires_php }</td>
				</tr>
			) }
		</>
	);
};

export default RequiresPHP;
