import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Section from 'components/Section';
import Select from 'components/Select/Select';
import SelectBoolean from 'components/Select/SelectBoolean';
import SelectDuration from 'components/Select/SelectDuration';
import SimpleGrid from 'components/SimpleGrid';
import Slider from 'components/Slider';
import { bitwiseHas, bitwiseSet, updateSliderValueObj } from 'lib/util/util';
import React, { Fragment } from 'react';

const ReactionsFilterPage = props => {
	const { reactions } = props.guildSettings.selfmod;

	return (
		<Fragment>
			<Section title="Reaction Filter">
				<SimpleGrid>
					<SelectBoolean
						title={`Filter ${reactions.enabled ? 'Enabled' : 'Disabled'}`}
						onChange={event => props.patchGuildData({ selfmod: { reactions: { enabled: event.target.checked } } })}
						currentValue={reactions.enabled}
						description="Whether or not this system should be enabled."
					/>
					<SelectBoolean
						title={`Alerts ${bitwiseHas(reactions.softAction, 0b100) ? 'Enabled' : 'Disabled'}`}
						onChange={event =>
							props.patchGuildData({
								selfmod: { reactions: { softAction: bitwiseSet(reactions.softAction, 0b100, event.target.checked) } }
							})
						}
						currentValue={bitwiseHas(reactions.softAction, 0b100)}
						description="Toggle message alerts in the channel the infraction took place."
					/>
					<SelectBoolean
						title={`Logs ${bitwiseHas(reactions.softAction, 0b010) ? 'Enabled' : 'Disabled'}`}
						onChange={event =>
							props.patchGuildData({
								selfmod: { reactions: { softAction: bitwiseSet(reactions.softAction, 0b010, event.target.checked) } }
							})
						}
						currentValue={bitwiseHas(reactions.softAction, 0b010)}
						description="Toggle message logs in the moderation logs channel."
					/>
					<SelectBoolean
						title={`Deletes ${bitwiseHas(reactions.softAction, 0b001) ? 'Enabled' : 'Disabled'}`}
						onChange={event =>
							props.patchGuildData({
								selfmod: { reactions: { softAction: bitwiseSet(reactions.softAction, 0b001, event.target.checked) } }
							})
						}
						currentValue={bitwiseHas(reactions.softAction, 0b001)}
						description="Toggle message deletions."
					/>
				</SimpleGrid>
			</Section>
			<Section title="Punishments">
				<SimpleGrid direction="row" justify="flex-start">
					<Select
						title="Action"
						helperText="The action to perform as punishment"
						value={reactions.hardAction}
						onChange={e => props.patchGuildData({ selfmod: { reactions: { hardAction: e.target.value } } })}
					>
						<MenuItem value={0}>None</MenuItem>
						<MenuItem value={1}>Warning</MenuItem>
						<MenuItem value={2}>Kick</MenuItem>
						<MenuItem value={3}>Mute</MenuItem>
						<MenuItem value={4}>Softban</MenuItem>
						<MenuItem value={5}>Ban</MenuItem>
					</Select>
					<SelectDuration
						value={reactions.hardActionDuration}
						min={1000}
						onChange={duration => props.patchGuildData({ selfmod: { reactions: { hardActionDuration: duration } } })}
					></SelectDuration>
				</SimpleGrid>
				<Typography>Maximum Threshold</Typography>
				<Slider
					value={reactions.thresholdMaximum}
					onChange={(_, value) => props.patchGuildData(updateSliderValueObj('reactions', 'thresholdMaximum', value))}
					aria-labelledby="Reactions selfmod filter maximum threshold slider"
					valueLabelDisplay="auto"
					min={0}
					max={60}
				/>
				<Typography>Threshold Duration</Typography>
				<Slider
					value={reactions.thresholdDuration}
					onChange={(_, value) => props.patchGuildData(updateSliderValueObj('reactions', 'thresholdDuration', value))}
					aria-labelledby="Reactions selfmod filter threshold duration slider"
					valueLabelDisplay="auto"
					min={0}
					max={120}
				/>
			</Section>
		</Fragment>
	);
};

export default ReactionsFilterPage;
