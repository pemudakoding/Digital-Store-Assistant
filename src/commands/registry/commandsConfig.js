/**
 * Command configurations organized by category
 * This file contains metadata for all commands to ensure consistency
 */

export const commandsConfig = {
    // General commands - accessible to all users
    general: {
        help: {
            description: 'Menampilkan menu bantuan',
            aliases: ['koalaaa']
        },
        allmenu: {
            description: 'Menampilkan semua menu'
        },
        ping: {
            description: 'Cek status bot'
        },
        donasi: {
            description: 'Informasi donasi',
            aliases: ['donate']
        },
        sticker: {
            description: 'Convert gambar/video ke sticker',
            aliases: ['s', 'stiker']
        },
        ffstalk: {
            description: 'Cek info player Free Fire'
        },
        mlstalk: {
            description: 'Cek info player Mobile Legends'
        },
        owner: {
            description: 'Info kontak owner'
        },
        tiktok: {
            description: 'Download video TikTok',
            aliases: ['tiktokowner']
        },
        tiktokaudio: {
            description: 'Download audio TikTok',
            aliases: ['tiktokaudiobot']
        },
        afk: {
            description: 'Set status AFK',
            adminOnly: true,
            groupOnly: true
        },
        cekafk: {
            description: 'Cek siapa yang sedang AFK',
            groupOnly: true
        },
        previewlist: {
            description: 'Preview produk dengan gambar',
            aliases: ['preview'],
            groupOnly: true
        },
        ceksewa: {
            description: 'Cek status sewa'
        },
        script: {
            description: 'Info script bot'
        }
    },

    // Calculator commands - mathematical operations
    calculator: {
        tambah: {
            description: 'Tambah dua angka'
        },
        kurang: {
            description: 'Kurang dua angka'
        },
        kali: {
            description: 'Kali dua angka'
        },
        bagi: {
            description: 'Bagi dua angka'
        }
    },

    // Store commands - digital store operations
    store: {
        list: {
            description: 'Menampilkan daftar produk',
            aliases: ['shop']
        },
        testi: {
            description: 'Tampilkan list testimoni',
            privateOnly: true
        },
        produk: {
            description: 'Tampilkan list produk',
            aliases: ['listproduk'],
            privateOnly: true
        },

    },

    // Admin commands - group moderation and management
    admin: {
        addlist: {
            description: 'Tambah item ke list',
            adminOnly: true,
            groupOnly: true
        },
        dellist: {
            description: 'Hapus item dari list',
            adminOnly: true,
            groupOnly: true
        },
        hidetag: {
            description: 'Tag semua member tersembunyi',
            aliases: ['h'],
            adminOnly: true,
            groupOnly: true
        },
        tagall: {
            description: 'Tag semua member',
            adminOnly: true,
            groupOnly: true
        },
        kick: {
            description: 'Kick member dari grup',
            adminOnly: true,
            groupOnly: true
        },
        group: {
            name: 'groupsetting',
            description: 'Buka/tutup grup',
            aliases: ['group', 'grup'],
            adminOnly: true,
            groupOnly: true
        },
        proses: {
            description: 'Tandai pesanan sedang diproses',
            aliases: ['p'],
            adminOnly: true,
            groupOnly: true
        },
        done: {
            description: 'Tandai pesanan selesai',
            aliases: ['d'],
            adminOnly: true,
            groupOnly: true
        },
        unafk: {
            description: 'Hapus status AFK user lain',
            adminOnly: true,
            groupOnly: true
        },
        removeimage: {
            description: 'Hapus gambar dari produk list',
            aliases: ['delimage'],
            adminOnly: true,
            groupOnly: true
        },
        antilink: {
            description: 'Toggle antilink',
            adminOnly: true,
            groupOnly: true
        },
        antilink2: {
            description: 'Toggle antilink2',
            adminOnly: true,
            groupOnly: true
        },
        welcome: {
            description: 'Toggle welcome message',
            adminOnly: true,
            groupOnly: true
        },
        delete: {
            description: 'Delete message',
            aliases: ['del'],
            adminOnly: true,
            groupOnly: true
        },
        linkgrup: {
            name: 'linkgc',
            description: 'Get group link',
            adminOnly: true,
            groupOnly: true
        },
        revoke: {
            description: 'Revoke group link',
            adminOnly: true,
            groupOnly: true
        },
        fitnah: {
            description: 'Fitnah message',
            adminOnly: true,
            groupOnly: true
        },
        setdone: {
            description: 'Set done message',
            adminOnly: true,
            groupOnly: true
        },
        delsetdone: {
            description: 'Delete set done',
            adminOnly: true,
            groupOnly: true
        },
        setproses: {
            description: 'Set proses message',
            adminOnly: true,
            groupOnly: true
        },
        delsetproses: {
            description: 'Delete set proses',
            adminOnly: true,
            groupOnly: true
        },
        updatelist: {
            description: 'Update list item',
            adminOnly: true,
            groupOnly: true
        },
        changelist: {
            description: 'Change list item',
            adminOnly: true,
            groupOnly: true
        },
        open: {
            description: 'Open group',
            adminOnly: true,
            groupOnly: true
        },
        close: {
            description: 'Close group',
            adminOnly: true,
            groupOnly: true
        },
        hapuslist: {
            description: 'Hapus list',
            adminOnly: true,
            groupOnly: true
        }
    },

    // Owner commands - bot administration and system management
    owner: {
        broadcast: {
            description: 'Broadcast pesan',
            ownerOnly: true
        },
        mode: {
            description: 'Switch bot mode',
            ownerOnly: true
        },
        join: {
            description: 'Join grup via link',
            ownerOnly: true
        },
        block: {
            description: 'Block user',
            ownerOnly: true
        },
        unblock: {
            description: 'Unblock user',
            ownerOnly: true
        },
        addsewa: {
            description: 'Tambah grup sewa',
            ownerOnly: true
        },
        delsewa: {
            description: 'Hapus grup sewa',
            ownerOnly: true
        },
        listsewa: {
            description: 'List grup sewa',
            ownerOnly: true
        },
        addtesti: {
            description: 'Tambah testimoni',
            ownerOnly: true
        },
        deltesti: {
            description: 'Hapus testimoni',
            ownerOnly: true
        },

        addproduk: {
            description: 'Tambah produk',
            ownerOnly: true
        },
        delproduk: {
            description: 'Hapus produk',
            ownerOnly: true
        },
        logout: {
            description: 'Force logout and destroy session',
            ownerOnly: true
        },
        queuestats: {
            description: 'Show queue statistics',
            ownerOnly: true
        },
        afkstats: {
            description: 'Show AFK statistics across all groups',
            ownerOnly: true
        },
        botstat: {
            description: 'Show comprehensive bot health statistics',
            aliases: ['botstatus', 'health'],
            ownerOnly: true
        },
        resetqueue: {
            description: 'Reset and clear all bot queues to restore responsiveness',
            aliases: ['reset', 'clearqueue'],
            ownerOnly: true
        },
        reloadcommands: {
            description: 'Hot reload all commands (development only)',
            aliases: ['reload', 'hotreload'],
            ownerOnly: true
        },
        commandinfo: {
            description: 'Show command registry information and statistics',
            aliases: ['cmdinfo', 'commandstats'],
            ownerOnly: true
        },
        queuemonitor: {
            description: 'Advanced queue monitoring and management with timeout analysis',
            aliases: ['qmon', 'queuemon'],
            ownerOnly: true
        }
    }
};

/**
 * Get command configuration by category and command name
 */
export function getCommandConfig(category, commandName) {
    return commandsConfig[category]?.[commandName] || {};
}

/**
 * Get all commands in a category
 */
export function getCategoryCommands(category) {
    return commandsConfig[category] || {};
}

/**
 * Get all available categories
 */
export function getAllCategories() {
    return Object.keys(commandsConfig);
}

/**
 * Find command by alias
 */
export function findCommandByAlias(alias) {
    for (const [category, commands] of Object.entries(commandsConfig)) {
        for (const [commandName, config] of Object.entries(commands)) {
            if (config.aliases?.includes(alias)) {
                return { category, commandName, config };
            }
        }
    }
    return null;
}

/**
 * Get total command count
 */
export function getTotalCommandCount() {
    return Object.values(commandsConfig)
        .reduce((total, category) => total + Object.keys(category).length, 0);
} 