import { FontAwesomeIcon } from '../FontAwesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const Downloads = ( props: any ) => {
	const { plugin, showDownloads } = props;
	return (
		<>
			{ showDownloads && (
				<tr>
					<td>
						<abbr title="Downloads">
							<FontAwesomeIcon
								icon={ faDownload }
								className="me-2"
							/>
						</abbr>
					</td>
					<td className="text-end">
						{ plugin.downloaded.toLocaleString() }
					</td>
				</tr>
			) }
		</>
	);
};

export default Downloads;
