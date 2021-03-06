import { getGlobal, setGlobal } from 'reactn';
import { FlattenedGuild, OauthFlattenedUser } from '../types/ApiData';
import { SelfmodSliderProp, SelfmodSliderSettings } from '../types/GuildSettings';
import { BASE_API_URL, history } from './constants';
import { Time } from './skyraUtils';

export function sleep(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export async function logOut() {
	await apiFetch<{ user: OauthFlattenedUser }>('/oauth/logout', { method: 'POST' });
	localStorage.clear();
	setGlobal({ pack: undefined, authenticated: false });
	history.replace('/');
}

export const loadState = <T>(key: string): T | null => {
	const serializedState = localStorage.getItem(key);
	return serializedState ? (JSON.parse(serializedState) as T) : null;
};

export const saveState = <T>(key: string, state: T): T => {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(key, serializedState);
	} catch {
		// intentionally empty
	}

	return state;
};

export async function apiFetch<T>(path: string, options: RequestInit = {}) {
	if (process.env.NODE_ENV === 'development') {
		await sleep(1000);
	}

	const response = await fetch(`${BASE_API_URL}${path}`, {
		...options,
		credentials: 'include',
		headers: {
			...options.headers,
			'Content-Type': 'application/json'
		}
	});

	const jsonResponse = await response.json();

	if (jsonResponse.error) {
		throw response;
	} else {
		return jsonResponse as T;
	}
}

export async function syncUser() {
	// If they're not logged in, don't try to sync.
	if (!getGlobal().authenticated) return;

	// Check if they've synced in the past 5 minutes.
	const lastSync = loadState('last_sync') as number;
	const difference = Date.now() - lastSync;
	if (difference < Time.Minute * 5) {
		return;
	}

	saveState('last_sync', Date.now());

	const response = await apiFetch<{ user: OauthFlattenedUser }>('/oauth/user', {
		method: 'POST',
		body: JSON.stringify({
			action: 'SYNC_USER'
		})
	}).catch(err => {
		if (err.status === 401 || err.status === 403) logOut();
	});

	if (!response) return;

	if (response.user) {
		setGlobal({ pack: response });
	}
}

export function navigate(path: string) {
	if (path.startsWith('http')) {
		return () => (window.location.href = path);
	}
	return () => history.push(path);
}

export function displayIconURL(guild: FlattenedGuild, { format = 'default', size = 256 } = {}) {
	if (guild.icon === null) return undefined;
	if (format === 'default') format = guild.icon.startsWith('a_') ? 'gif' : 'png';
	return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${format}${`?size=${size}`}`;
}

/**
 * Retrieves an acronym for a guild name based on Discord datamining
 * @see https://github.com/discordjs/discord.js/pull/4104
 * @param name The guild name to retrieve the acronym for
 */
export function getAcronym(name: string) {
	return name
		.replace(/'s /g, ' ')
		.replace(/\w+/g, e => e[0])
		.replace(/\s/g, '');
}

export function removeNonAlphaNumeric(str: string) {
	return str.replace(/[^0-9a-zA-Z]/gi, '');
}

/**
 * Check if a bit is set in a bitfield.
 * @param bits The bitfield value to check.
 * @param bit The bit to check.
 */
export function bitwiseHas(bits: number, bit: number) {
	return (bits & bit) === bit;
}

/**
 * Toggle a bit in a bitfield.
 * @param bits The bitfield value to modify.
 * @param bit The bit to toggle.
 * @param toggle The value to set.
 */
export function bitwiseSet(bits: number, bit: number, toggle: boolean) {
	return toggle ? bits | bit : bits & ~bit;
}

/**
 * Parses command descriptions, replacing emojis with their proper counterparts
 * @param description Command description to parse
 */
export const parseCommandDescription = (description: string) => description.replace(/<:(\w{2,32}):[0-9]{18}>/gi, '$1');

export const updateSliderValueObj = (category: keyof SelfmodSliderSettings, prop: SelfmodSliderProp, value: number | number[]) => ({
	selfmod: {
		[category]: {
			[prop]: Array.isArray(value) ? value[0] : value
		}
	}
});
