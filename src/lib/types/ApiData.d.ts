export interface DashboardPack {
	user: DashboardUserPack | null;
}

export interface DashboardUserPack extends FlattenedUser {
	guilds?: FlattenedGuild[];
}

export interface FlattenedGuild {
	id: string;
	available: boolean;
	channels: FlattenedGuildChannel[];
	roles: FlattenedRole[];
	name: string;
	icon: string | null;
	splash: string | null;
	region: string;
	features: GuildFeatures[];
	applicationID: string | null;
	afkTimeout: number;
	afkChannelID: string | null;
	systemChannelID: string | null;
	embedEnabled: boolean;
	premiumTier: number;
	premiumSubscriptionCount: number | null;
	verificationLevel: number;
	explicitContentFilter: number;
	mfaLevel: number;
	joinedTimestamp: number;
	defaultMessageNotifications: number | 'ALL' | 'MENTIONS';
	vanityURLCode: string | null;
	description: string | null;
	banner: string | null;
	ownerID: string;
	emojis: FlattenedEmoji[];
	skyraIsIn: boolean;
	manageable: boolean;
}

export interface FlattenedEmoji {
	name: string;
	roles: any[];
	id: string;
	require_colons: boolean;
	managed: boolean;
	animated: boolean;
	available: boolean;
}

export interface FlattenedRole {
	id: string;
	guildID: string;
	name: string;
	color: number;
	hoist: boolean;
	rawPosition: number;
	permissions: number;
	managed: boolean;
	mentionable: boolean;
}

export interface FlattenedChannel {
	id: string;
	type: 'dm' | 'text' | 'voice' | 'category' | 'news' | 'store' | 'unknown';
	createdTimestamp: number;
}

export interface FlattenedGuildChannel extends FlattenedChannel {
	type: 'text' | 'voice' | 'category' | 'news' | 'store' | 'unknown';
	guildID: string;
	name: string;
	rawPosition: number;
	parentID: string | null;
	permissionOverwrites: [string, PermissionOverwrites][];
}

export interface FlattenedNewsChannel extends FlattenedGuildChannel {
	type: 'news';
	topic: string | null;
	nsfw: boolean;
}

export interface FlattenedTextChannel extends FlattenedGuildChannel {
	type: 'text';
	topic: string | null;
	nsfw: boolean;
	rateLimitPerUser: number;
}

export interface FlattenedVoiceChannel extends FlattenedGuildChannel {
	type: 'voice';
	bitrate: number;
	userLimit: number;
}

export interface FlattenedDMChannel extends FlattenedChannel {
	type: 'dm';
	recipient: string;
}

export interface FlattenedUser {
	id: string;
	bot: boolean;
	username: string;
	discriminator: string;
	avatar: string | null;
	avatarURL: string | null;
}

export interface FlattenedMember {
	id: string;
	guildID: string;
	user: FlattenedUser;
	joinedTimestamp: number | null;
	premiumSinceTimestamp: number | null;
	roles: FlattenedRole[];
}

export interface FlattenedCommand {
	bucket: number;
	category: string;
	cooldown: number;
	description: string;
	guarded: boolean;
	guildOnly: boolean;
	name: string;
	permissionLevel: number;
	requiredPermissions: string[];
	usage: string;
}

export interface OauthFlattenedUser extends FlattenedUser {
	guilds: OauthFlattenedGuild[];
}
