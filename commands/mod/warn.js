/*
 * Antique-gold
 * Copyright (C) 2021 DevZ-Org
 * This software is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
 * For more information, see README.md and LICENSE
  */
  
const { MessageEmbed } = require('discord.js');
const db = require("quickmongo");

module.exports = {
	name: 'warn',
	cooldown: 5000,
	category: 'moderation',
	uimage:
		'https://media.discordapp.net/attachments/803290746496221264/803503220780826644/unknown.png',
	usage: '`warn <@mention> <reason>`',
	description: 'Warn anyone who do not obey the rules',
	run: async (client, message, args) => {
		if (!message.member.hasPermission('ADMINISTRATOR')) {
			return message.channel.send(
				'Dont try to warn without permissions. Go get it first. '
			);
		}

		const user = message.mentions.members.first();

		if (!user) {
			return message.channel.send(
				'Please Mention the person to who you want to warn - warn @mention <reason>'
			);
		}

		if (message.mentions.users.first().bot) {
			return message.channel.send('You can not warn bots');
		}

		if (message.author.id === user.id) {
			return message.channel.send('Are you alright? you can not warn yourself');
		}

		if (user.id === message.guild.owner.id) {
			return message.channel.send(
				'You jerk, how you can warn server owner -_-'
			);
		}

		const reason = args.slice(1).join(' ');

		if (!reason) {
			return message.channel.send(
				'Please provide reason to warn - warn @mention <reason>'
			);
		}

		let warnings = db.get(`warnings_${message.guild.id}_${user.id}`);

		if (warnings === null) {
			db.set(`warnings_${message.guild.id}_${user.id}`, 1);
			user.send(
				`You have been warned in **${message.guild.name}** for ${reason}`
			);
			await message.channel.send(
				`You warned **${
					message.mentions.users.first().username
				}** for ${reason}`
			);
		} else if (warnings !== null) {
			db.add(`warnings_${message.guild.id}_${user.id}`, 1);

			user.send(
				`You have been warned in **${message.guild.name}** for ${reason}`
			);

			await message.channel.send(
				`You warned **${
					message.mentions.users.first().username
				}** for ${reason}`
			);

			message.delete;
		}
	}
};
