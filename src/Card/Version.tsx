import { FontAwesomeIcon } from '../FontAwesome';
import { faTag } from '@fortawesome/free-solid-svg-icons';

const Version = ( props: any ) => {
	const { plugin, showVersion } = props;
	return (
		<>
			{ showVersion && (
				<tr>
					<td>
						<abbr title="Version">
							<FontAwesomeIcon icon={ faTag } className="me-2" />
						</abbr>
					</td>
					<td className="text-end">{ plugin.version }</td>
				</tr>
			) }
		</>
	);
};

export default Version;
